import csvToJson from "convert-csv-to-json";

const fileInputName = "data/data.csv";
const fileOutputName = "data/data.json";

csvToJson
  .supportQuotedField(true)
  .fieldDelimiter(",")
  .generateJsonFileFromCsv(fileInputName, fileOutputName);
