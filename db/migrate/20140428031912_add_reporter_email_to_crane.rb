class AddReporterEmailToCrane < ActiveRecord::Migration
  def change
    add_column :cranes, :reporter_email, :string
  end
end
