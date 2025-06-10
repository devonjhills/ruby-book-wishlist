class Api::SearchController < ApplicationController
  before_action :require_authentication
  
  def books
    query = params[:q]
    return render_json_error('Query parameter required') if query.blank?
    
    begin
      # Search for books with multiple approaches to get English metadata
      search_responses = []
      
      # First try: Search with English language preference
      enhanced_query = "#{query} language:eng"
      response = HTTParty.get("https://openlibrary.org/search.json", {
        query: { q: enhanced_query, limit: 5 }
      })
      search_responses << response if response.success?
      
      # Second try: Regular search if we need more results
      if !response.success? || (response.success? && response['docs'].length < 3)
        regular_response = HTTParty.get("https://openlibrary.org/search.json", {
          query: { q: query, limit: 8 }
        })
        search_responses << regular_response if regular_response.success?
      end
      
      # Use the best response we got
      response = search_responses.first
      
      if response.success?
        all_books = []
        
        # Combine results from all search responses and deduplicate
        search_responses.each do |search_resp|
          next unless search_resp.success?
          all_books.concat(search_resp['docs'] || [])
        end
        
        # Remove duplicates based on work key
        unique_books = all_books.uniq { |book| book['key'] }
        
        books = unique_books.take(10).map do |book|
          # Get comprehensive book info with preference for English metadata
          book_data = {
            external_id: book['key'],
            title: get_best_title(book),
            author_or_director: get_best_author(book),
            cover_image_url: book['cover_i'] ? "https://covers.openlibrary.org/b/id/#{book['cover_i']}-M.jpg" : nil,
            release_year: book['first_publish_year'],
            description: nil,
            # Additional fields for detailed view
            page_count: book['number_of_pages_median'],
            isbn: book['isbn'] ? book['isbn'].first : nil,
            publisher: book['publisher'] ? book['publisher'].first : nil,
            language: book['language'] ? book['language'].join(', ') : nil,
            subjects: book['subject'] ? book['subject'].take(5).join(', ') : nil,
            average_rating: book['ratings_average'],
            rating_count: book['ratings_count'],
            first_sentence: book['first_sentence'] ? book['first_sentence'].first : nil
          }
          
          # Try to get detailed description from works API
          work_key = book['key']
          if work_key.present?
            begin
              work_response = HTTParty.get("https://openlibrary.org#{work_key}.json")
              if work_response.success?
                # Get description
                if work_response['description']
                  description = work_response['description']
                  if description.is_a?(Hash) && description['value']
                    book_data[:description] = description['value']
                  elsif description.is_a?(String)
                    book_data[:description] = description
                  end
                end
                
                # Try to get better English title from work data
                if work_response['title'] && is_likely_english?(work_response['title'])
                  book_data[:title] = work_response['title']
                end
              end
            rescue => detail_error
              Rails.logger.warn "Failed to get book details for #{work_key}: #{detail_error.message}"
            end
          end
          
          book_data
        end
        
        render json: { results: books }
      else
        render_json_error('External API error', :bad_gateway)
      end
    rescue => e
      render_json_error('Search service unavailable', :service_unavailable)
    end
  end
  
  private
  
  def get_best_title(book)
    # Try to find English title from various fields
    title = book['title']
    
    # Check if we have alternative titles and pick English one
    if book['title_suggest'] && book['title_suggest'].is_a?(Array)
      english_title = book['title_suggest'].find { |t| is_likely_english?(t) }
      title = english_title if english_title
    end
    
    # If original title looks like non-English, try to find translated version
    if !is_likely_english?(title) && book['alternative_title']
      if book['alternative_title'].is_a?(Array)
        english_alt = book['alternative_title'].find { |t| is_likely_english?(t) }
        title = english_alt if english_alt
      elsif is_likely_english?(book['alternative_title'])
        title = book['alternative_title']
      end
    end
    
    title
  end
  
  def get_best_author(book)
    # Try to find English author name
    author = book['author_name']&.first
    
    # If author_name has multiple entries, prefer English-looking ones
    if book['author_name'] && book['author_name'].is_a?(Array) && book['author_name'].length > 1
      english_author = book['author_name'].find { |name| is_likely_english?(name) }
      author = english_author if english_author
    end
    
    author
  end
  
  def is_likely_english?(text)
    return false if text.blank?
    
    # Simple heuristic: check if text contains mostly Latin characters
    # and common English words, and avoid obvious non-English characters
    latin_chars = text.scan(/[a-zA-Z\s\-'.,]/).length
    total_chars = text.gsub(/\s/, '').length
    
    return false if total_chars == 0
    
    # If more than 80% are Latin characters, likely English
    ratio = latin_chars.to_f / total_chars
    ratio > 0.8 && !contains_cjk_characters?(text)
  end
  
  def contains_cjk_characters?(text)
    # Check for Chinese, Japanese, Korean characters
    text.match?(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/)
  end
  
end