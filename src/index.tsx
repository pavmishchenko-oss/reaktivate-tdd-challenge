import React from 'react';
import ReactDOM from 'react-dom';
import './mobx-config'; // Configure MobX strict mode
import './styles.css';
import BooksContainer from './view/BooksContainer';

ReactDOM.render(
  <BooksContainer />,
  document.getElementById('root')
);
