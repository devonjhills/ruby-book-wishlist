# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_31_120000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "items", force: :cascade do |t|
    t.string "title", null: false
    t.string "item_type", null: false
    t.string "status", null: false
    t.integer "rating"
    t.text "notes"
    t.string "external_id"
    t.string "cover_image_url"
    t.string "author_or_director"
    t.string "genre"
    t.integer "release_year"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.index "to_tsvector('english'::regconfig, (((COALESCE(title, ''::character varying))::text || ' '::text) || (COALESCE(author_or_director, ''::character varying))::text))", name: "index_items_on_fulltext_search", using: :gin
    t.index ["external_id"], name: "index_items_on_external_id"
    t.index ["item_type"], name: "index_items_on_item_type"
    t.index ["status"], name: "index_items_on_status"
    t.index ["user_id", "created_at"], name: "index_items_on_user_id_and_created_at"
    t.index ["user_id", "rating"], name: "index_items_on_user_id_and_rating", where: "(rating IS NOT NULL)"
    t.index ["user_id", "status"], name: "index_items_on_user_id_and_status"
    t.index ["user_id", "updated_at"], name: "index_items_on_user_id_and_updated_at"
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "items", "users"
end
