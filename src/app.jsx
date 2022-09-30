import React from 'react'
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Bar from './examples/bar';
import Camera from './examples/camera';

const router = createHashRouter([
    {
        path: "/bar",
        element: <div style={{background: 'black'}}><Bar /></div>,
    },
    {
        path: "/",
        element: <div>hello</div>,
    },
    {
        path: '/camera',
        element: <Camera />
    }
]);

const App = () => {
    return <RouterProvider router={router}></RouterProvider>
}   

export default App