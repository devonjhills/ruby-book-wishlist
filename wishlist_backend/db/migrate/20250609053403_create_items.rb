class CreateItems < ActiveRecord::Migration[8.0]
  def change
    create_table :items do |t|
      t.string :title, null: false
      t.string :item_type, null: false
      t.string :status, null: false
      t.integer :rating
      t.text :notes
      t.string :external_id
      t.string :cover_image_url
      t.string :author_or_director
      t.string :genre
      t.integer :release_year
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :items, :item_type
    add_index :items, :status
  end
end
