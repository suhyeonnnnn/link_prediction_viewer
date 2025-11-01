import Papa from 'papaparse';

export const loadCSV = async (filename) => {
  try {
    const response = await fetch(`/${filename}`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(`✅ Loaded ${results.data.length} rows from ${filename}`);
          resolve(results.data);
        },
        error: (error) => {
          console.error(`❌ Error loading ${filename}:`, error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`❌ Error fetching ${filename}:`, error);
    throw error;
  }
};

export const loadJSON = async (filename) => {
  try {
    const response = await fetch(`/${filename}`);
    const data = await response.json();
    console.log(`✅ Loaded JSON from ${filename}`);
    return data;
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error);
    throw error;
  }
};

export const loadAllData = async () => {
  try {
    console.log('📥 Loading data files...');
    
    const [csvData, childRelations] = await Promise.all([
      loadCSV('top_predicted_pairs.csv'),
      loadJSON('child_relationships.json')
    ]);
    
    console.log('✅ All data loaded successfully');
    return { csvData, childRelations };
  } catch (error) {
    console.error('❌ Error loading data:', error);
    throw error;
  }
};
