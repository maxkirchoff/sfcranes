class AddPhotodToCrane < ActiveRecord::Migration
  def change
    add_column :cranes, :photod, :boolean
  end
end
