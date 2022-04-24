import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell, initialCode } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        draft.data[id].content = content;
        break;

      case ActionType.DELETE_CELL:
        delete draft.data[action.payload];
        draft.order = draft.order.filter((id) => id !== action.payload);
        break;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;

        const curIndex = draft.order.findIndex(
          (value) => value === action.payload.id
        );
        const targetIndex = direction === "up" ? curIndex - 1 : curIndex + 1;

        const isIndexNegative = targetIndex < 0;
        const isIndexMoreThanMaximum = targetIndex >= state.order.length;

        if (isIndexNegative || isIndexMoreThanMaximum) {
          break;
        }

        const tempId = state.order[curIndex];
        draft.order[curIndex] = draft.order[targetIndex];
        draft.order[targetIndex] = tempId;

        break;

      case ActionType.INSERT_CELL_BEFORE:
        const cell: Cell = {
          content: action.payload.type === "code" ? initialCode : "",
          type: action.payload.type,
          id: randomId(),
        };

        const targetIndex_2 = draft.order.findIndex(
          (value) => value === action.payload.id
        );

        draft.data[cell.id] = cell;

        if (targetIndex_2 === -1) {
          draft.order.push(cell.id);
          break;
        }

        draft.order.splice(targetIndex_2, 0, cell.id);
        break;

      case ActionType.INSERT_CELL_AFTER:
        const cell_2: Cell = {
          content: action.payload.type === "code" ? initialCode : "",
          type: action.payload.type,
          id: randomId(),
        };

        const targetIndex_3 =
          draft.order.findIndex((value) => value === action.payload.id) + 1;

        draft.data[cell_2.id] = cell_2;

        if (targetIndex_3 === state.order.length) {
          draft.order.push(cell_2.id);
          break;
        }

        draft.order.splice(targetIndex_3, 0, cell_2.id);
        break;

      case ActionType.FETCH_CELLS_START:
        draft.loading = true;
        draft.error = null;

        break;

      case ActionType.FETCH_CELLS_COMPLETE:
        draft.order = action.payload.map((cell) => cell.id);
        draft.data = action.payload.reduce(
          (prev, cell) => ({ ...prev, [cell.id]: cell }),
          {}
        );

        break;

      case ActionType.FETCH_CELLS_ERROR:
        draft.loading = false;
        draft.error = action.payload;

        break;

      case ActionType.SAVE_CELLS_ERROR:
        draft.error = action.payload;

        break;

      default:
        break;
    }
  });
};

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;
