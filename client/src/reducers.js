
const selectFoodReducer = (state = {number: 0, selectedFoods: [], idx: 0}, action) => {
  switch (action.type) {
    case 'ADD':
      return Object.assign({}, state, {
        number: state.number+1,
        selectedFoods: state.selectedFoods.concat(action.selectedFood)
      });
    case 'REMOVE':
      return Object.assign({}, state, {
        number: state.number-1,
        selectedFoods: [
          ...state.selectedFoods.slice(0, action.idx),
          ...state.selectedFoods.slice(
            action.idx + 1, state.selectedFoods.length
          ),
        ],
      });
    default:
      return state;
  }
};

export { selectFoodReducer };