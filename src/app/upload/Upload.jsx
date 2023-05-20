// import React from 'react';
// import { useFilePicker } from 'use-file-picker';
// import './Upload.css'
// import { saveAs } from 'file-saver';
// function Upload(props) {
//     console.log(props.darkMode);
//     const [openFileSelector, { filesContent, loading }] = useFilePicker({
//         accept: ['.mp4', '.m4v']
//     });

//     if (loading) {
//         return <div className='file-picker'><h2>Loading...</h2></div>;
//     }

//     if (filesContent) {
//         filesContent.map((file) => {
//             var blob = new Blob([file.content], {'type' : 'video\/m4v'})
//             saveAs(blob, 'video.m4v');
//         });
//     }

//     return (
//         <div className='file-picker'>
//             <button className={props.darkMode ? 'file-picker-button-light' : 'file-picker-button-dark'} onClick={() => openFileSelector()}>Select files </button>
//             <br />
//             {filesContent.map((file, index) => (
//                 <div>
//                     <h2>{file.name}</h2>
//                     <br />
//                 </div>
//             ))}
//         </div>
//     );
// }
// export default Upload;