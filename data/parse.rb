require 'csv'

def to_filename(tour_title)
  unless tour_title.nil?
    return tour_title.strip.downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9_-]/, '').squeeze('-') + ".csv"
  end
end

CSV.foreach("data.csv", :headers => true) do |row|
  tour_title = row['Tour']
  tour_file = to_filename(row['Tour'])
  headers = row.headers

  unless tour_file.nil?
    if File.exists?(tour_file)
      CSV.open(tour_file, "a+") do |csv| 
        csv << row
      end
    else  
      CSV.open(tour_file, "a+") do |csv| 
        csv << headers
        csv << row
      end
    end
  end
end

