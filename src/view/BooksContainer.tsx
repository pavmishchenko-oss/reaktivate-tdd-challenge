import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import BooksController from '../viewmodel/BooksController';
import Books from './Books';

const BooksContainer = observer(() => {
  const [controller] = useState(() => new BooksController());

  useEffect(() => {
    controller.initialize();
    
    // Cleanup function for controller lifecycle
    return () => {
      controller.dispose();
    };
  }, [controller]);

  return <Books controller={controller} />;
});

export default BooksContainer;
