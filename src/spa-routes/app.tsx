import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './layout';

export default function App() {
  console.log('App');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/spa" element={<Layout />}>
          <Route index element={<p>page one</p>} />
          <Route path="page-two" element={<p>page two</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
