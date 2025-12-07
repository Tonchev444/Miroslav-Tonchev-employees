const CsvUploader = ({ uploadError, handleFileUpload, hangleCheck, data }) => {
  return (
    <div className="card">
      <h4>Find the top collaborators</h4>
      <p className="description">
        Upload a CSV file with all the employees of your compary with the
        project IDs and work time for each project to find whitch of your
        employees are the longers collaborators
      </p>
      {uploadError && <p className="validation-error">{uploadError}</p>}
      <div className="file-uploader-container">
        <input type="file" onChange={handleFileUpload} accept=".csv" />
      </div>
      <button
        type="button"
        onClick={hangleCheck}
        disabled={uploadError || !data?.length}
      >
        Check
      </button>
    </div>
  );
};

export default CsvUploader;
