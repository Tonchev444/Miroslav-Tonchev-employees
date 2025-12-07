import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { UPLOAD_CSV_TEXT } from "./consts/consts";
import { checkForLongestCollab, transformToArr } from "./utils/utils";
import CsvUploader from "./components/CsvUploader";
import Results from "./components/Results";

function App() {
  const [data, setData] = useState();
  const [uploadError, setUploadError] = useState(null);
  const [topCollabData, setTopCollabData] = useState(null);

  const hangleCheck = () => {
    if (data?.length) {
      checkForLongestCollab(data, setTopCollabData);
    } else {
      alert(UPLOAD_CSV_TEXT);
    }
  };

  const handleFileUpload = async (e) => {
    setUploadError(null);
    setTopCollabData(null);
    console.log(e.target.files[0]);
    const file = e.target.files[0];

    if (!file) return;
    const newData = await transformToArr(file, setUploadError);
    setData(newData);
    console.log("Matrix:", data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>TOP COLLABORATORS</h3>
      </header>
      <section>
        <CsvUploader
          data={data}
          handleFileUpload={handleFileUpload}
          hangleCheck={hangleCheck}
          uploadError={uploadError}
        />
      </section>
      <section>{topCollabData && <Results data={topCollabData} />}</section>
      <footer></footer>
    </div>
  );
}

export default App;
