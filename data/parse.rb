require 'csv'

def to_filename(tour_title)
  if tour_title.nil?
    "no_tour.csv"
  else
    tour_title.strip.downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9_-]/, '').squeeze('-') + ".csv"
  end
end

Dir.chdir "data" do
  `mkdir -p ../tmp/data`
  (Dir["../tmp/data/*.csv"]).each { |f| File.delete(f) }

  def blank?(embed)
    embed.nil? || embed.strip.empty?
  end

  CSV.foreach("data.csv", :headers => true) do |row|
    unless blank?(row['Streetview Embed Code'])
      tour_file = '../tmp/data/' + to_filename(row['Tour'])
      if File.exists?(tour_file)
        CSV.open(tour_file, "a+") do |csv|
          csv << row
        end
      else
        CSV.open(tour_file, "a+") do |csv|
          csv << row.headers
          csv << row
        end
      end
    end
  end
end

