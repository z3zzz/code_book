import "bulmaswatch/superhero/bulmaswatch.min.css";
import ReactDOM from "react-dom";
import { store } from "./state";
import { Provider } from "react-redux";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
