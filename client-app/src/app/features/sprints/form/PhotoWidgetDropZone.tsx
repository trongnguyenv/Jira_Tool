import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

interface Props {
    setFiles: (files: any) => void;
}

function MyDropzone({setFiles}: Props) {
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius : '5px',
        textAlign: 'center' as 'center',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap' as 'wrap', 
        alignItems: 'center',
        height: '300px',
        cursor: 'pointer'
    }

    const dzActive = {
        borderColor: '#967BB6'
    }

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [setFiles]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} 
        style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
            <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drag and drop a file, or click this area to select from the file system.</p> :
                    <p>Drag and drop a file, or click this area to select from the file system.</p>
                }
        </div>
    )
}

export default MyDropzone;