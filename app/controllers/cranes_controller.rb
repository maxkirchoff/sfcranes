class CranesController < ApplicationController

  def new
  end

  def create
    @crane = Crane.new(crane_params)

    @crane.save
    redirect_to @crane
  end

  def show
    @crane = Crane.find(params[:id])
  end

  private
    def crane_params
      params.require(:crane).permit(:title, :notes)
    end
end

