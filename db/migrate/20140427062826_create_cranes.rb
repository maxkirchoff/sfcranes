class CreateCranes < ActiveRecord::Migration
  def change
    create_table :cranes do |t|
      t.string :title
      t.text :notes
      t.string :lat
      t.string :lon
      t.string :address

      t.timestamps
    end
  end
end
