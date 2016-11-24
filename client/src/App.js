import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import Client from './Client';
import { selectFoodReducer } from './Reducers';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFoods: [],
    };
  }
  render() {
    return (
      <div className='App'>
        <div className='ui text container'>
          <SelectedFood
            foodsNumber={this.props.state.number}
            foods={this.props.state.selectedFoods}
            onFoodRemove={
              (idx) => (
                store.dispatch({
                  type: 'REMOVE',
                  idx,
                })
              )
            }
          />
          <SearchFood
            onFoodSelect={
              (food) => (
                 store.dispatch({
                  type: 'ADD',
                  selectedFood: food,
                 })
              )
            }
          />
        </div>
      </div>
    );
  }
}

const MATCHING_ITEM_LIMIT = 25;
class SearchFood extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchingFoods: [],
      showRemoveIcon: false,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchCancel = this.handleSearchCancel.bind(this);
  }
  handleSearchChange() {
    const query = this.refs.search.value;

    if (query === '') {
      this.setState({
        matchingFoods: [],
        showRemoveIcon: false,
      });
    } else {
      Client.search(query).then((foods) => (
        this.setState({
          matchingFoods: foods.slice(0, MATCHING_ITEM_LIMIT),
          showRemoveIcon: true,
        })
      ));
    }
  }
  handleSearchCancel() {
    this.setState({
      matchingFoods: [],
      showRemoveIcon: false,
    });
    this.refs.search.value = '';
  }
  render() {
    const removeIconStyle = (
      this.state.showRemoveIcon ? {} : { display: 'none' }
    );
    return (
      <div id='food-search'>
        <table className='ui selectable structured large table'>
          <thead>
            <tr>
              <th colSpan='5'>
                <div className='ui fluid search'>
                  <div className='ui icon input'>
                    <input
                      className='prompt'
                      type='text'
                      placeholder='Search foods...'
                      ref='search'
                      onChange={this.handleSearchChange}
                    />
                    <i className='search icon' />
                  </div>

                  <i
                    className='remove icon'
                    style={removeIconStyle}
                    onClick={this.handleSearchCancel}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className='eight wide'>Description</th>
              <th>Kcal</th>
              <th>Protein (g)</th>
              <th>Fat (g)</th>
              <th>Carbs (g)</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.matchingFoods.map((food, idx) => (
                <tr
                  key={idx}
                  onClick={() => this.props.onFoodSelect(food)}
                >
                  <td>{food.description}</td>
                  <td className='right aligned'>{food.kcal}</td>
                  <td className='right aligned'>{food.sugar_g}</td>
                  <td className='right aligned'>{food.carbohydrate_g}</td>
                  <td className='right aligned'>{food.protein_g}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

const SelectedFood = (props) => (
  <table className='ui selectable structured large table'>
    <thead>
      <tr>
        <th colSpan='5'>
          <h3>{`Selected foods: ${props.foodsNumber}`}</h3>
        </th>
      </tr>
      <tr>
        <th className='eight wide'>Description</th>
        <th>Kcal</th>
        <th>Protein (g)</th>
        <th>Fat (g)</th>
        <th>Carbs (g)</th>
      </tr>
    </thead>
    <tbody>
      {
        props.foods.map((food, idx) => (
          <tr
            key={idx}
            onClick={() => props.onFoodRemove(idx)}
          >
            <td>{food.description}</td>
            <td className='right aligned'>{food.kcal}</td>
            <td className='right aligned'>{food.sugar_g}</td>
            <td className='right aligned'>{food.carbohydrate_g}</td>
            <td className='right aligned'>{food.protein_g}</td>
          </tr>
        ))
      }
    </tbody>
    <tfoot>
      <tr>
        <th>Total</th>
        <th className='right aligned'>
          {props.foods.reduce((memo, f) => f.kcal + memo, 0)}
        </th>
        <th className='right aligned'>
          {props.foods.reduce((memo, f) => f.sugar_g + memo, 0).toFixed(2)}
        </th>
        <th className='right aligned'>
          {props.foods.reduce((memo, f) => f.carbohydrate_g + memo, 0).toFixed(2)}
        </th>
        <th className='right aligned'>
          {props.foods.reduce((memo, f) => f.protein_g + memo, 0).toFixed(2)}
        </th>
      </tr>
    </tfoot>
  </table>
);

export const render = function() {
  ReactDOM.render(
    <App state={store.getState()}/>,
    document.getElementById('root')
  );
};

// store
const store = createStore(selectFoodReducer);
store.subscribe(render);


