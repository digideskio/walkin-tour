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

  def bad_streetview?(embed)
    embed.nil? || embed.strip.empty? || !embed.include?("https://www.google.com/maps/embed?pb=")
  end

  CSV.foreach("data.csv", :headers => true) do |row|
    unless bad_streetview?(row['Streetview Embed Code'])
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

