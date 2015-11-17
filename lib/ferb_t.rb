require 'erb'
require 'ostruct'

class FerbT
  def initialize(filename)
    @filename = filename
  end

  def with_binding(vars)
    @binding = OpenStruct.new(vars).instance_eval { binding }
    self
  end

  def write(outfile = @filename.gsub('.erb', ''))
    erb = ERB.new(File.read(@filename))
    File.write(outfile, erb.result(@binding))
  end
end