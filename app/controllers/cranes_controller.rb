class CranesController < ApplicationController

  def new
  end

  def create
    @crane = Crane.new(crane_params)

    @crane.save
    render :json => @crane
  end

  def show
    @crane = Crane.find(params[:id])
  end

  def index
    @cranes = Crane.all
  end

  def update
    @crane = Crane.find(params[:id])
    @crane.update(crane_params)
    @crane.save
    render :json => @crane
  end

  private
    def crane_params
      params.require(:crane).permit(:lat, :lon, :title, :notes)
    end
end

