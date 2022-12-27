import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import  "react-quill/dist/quill.snow.css";
import "./login/login.css";
import {InvisibleTextInput, StyledInput} from '../../../shared/form/Styles';
import PhotoWidgetDropZone from './PhotoWidgetDropZone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

export default observer(function ProfileEditForm() {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();
    const { accountStore } = useStore();
    const { uploadPhoto, uploading } = accountStore;
    const [loginError, setError] = useState('');
    var [emailState, setEmailState] = useState('');
    var [first_name_edit_state, setFirstNameEditState] = useState(false);
    var [second_name_edit_state, setSecondNameEditState] = useState(false);

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    function onCrop() {
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    function updateEmailState(value: string){
        setEmailState(value);
    }

    function toggleFirstNameEditState(){
        setFirstNameEditState(!first_name_edit_state);
    }

    function toggleSecondNameEditState(){
        setSecondNameEditState(!second_name_edit_state);
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file);
    }

        return (
    
            <div className='darkreader' style={{width:'100%', backgroundColor: 'transparent'}}>
                <div 
                    style={{
                        width: '100%', 
                        backgroundColor: 'transparent',
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        padding: '15px', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center',
                        backgroundSize: 'cover', 
                        position: 'relative', 
                        zIndex: '1'}}
                    >

                    {/* Profile Info Heading */}    
                    <div style={{width: '100%'}}>
                        <h2 style={{marginTop: '5px'}}>Profile Info</h2>
                    </div>

                    {/* Enter name and surname text inputs */}
                    <div 
                        style={{
                            marginTop: '30px', 
                            marginRight: '10px', 
                            display: 'inline', 
                            width: '45%'
                        }}>
                        <h4>First Name</h4>
                    {
                        !first_name_edit_state &&
                        <InvisibleTextInput 
                            style={{
                                display: "flex", 
                                maxHeight: "40px", 
                                minHeight: "40px"
                            }} 
                            fontsize={14} 
                            onClick={() => toggleFirstNameEditState()}>
                        
                            <h5 
                                style={{
                                    paddingTop: "10px", 
                                    paddingBottom: "10px", 
                                    paddingLeft: "5px"}}>
                                {accountStore.account!.first_name} 
                            </h5>
                        </InvisibleTextInput>
                    }     
                    {
                        first_name_edit_state &&
                        <input 
                            autoFocus 
                            type='text' 
                            name='first_name' 
                            onChange={(e) => {
                                setError(''); 
                                updateEmailState(e.target.value)
                            }} 
                            onBlur={() => toggleFirstNameEditState()}
                            style={{
                                border: '0.5px solid', 
                                marginBottom: '10px', 
                                color: 'white', 
                                backgroundColor: 'transparent', 
                                position: 'relative', 
                                width: '100%', 
                                lineHeight: '1.2', 
                                height: '45px', 
                                display: 'block', 
                                fontSize: '16px', 
                                padding: '0 5px 0 5px'
                            }}/>
                    }
                    </div>
                    <div style={{
                        marginTop: '30px', 
                        display: 'inline', 
                        width: '45%'
                        }}>
                    <h4>Surname</h4>
                    {
                        !second_name_edit_state &&
                        <InvisibleTextInput 
                            style={{
                                display: "flex", 
                                maxHeight: "40px", 
                                minHeight: "40px"
                            }} 
                            fontsize={14} 
                            onClick={() => toggleSecondNameEditState()}
                        >
                            <h5 
                                style={{
                                    paddingTop: "10px", 
                                    paddingBottom: "10px", 
                                    paddingLeft: "5px"}}
                                > 
                                {accountStore.account!.second_name} 
                            </h5>
                        </InvisibleTextInput>
                    }
                    {
                        second_name_edit_state &&
                        <input 
                            autoFocus 
                            type='text' 
                            name='second_name' 
                            onChange={(e) => {
                                setError(''); 
                                updateEmailState(e.target.value)
                            }} 
                            onBlur={() => toggleSecondNameEditState()}
                            style={{
                                border: '0.5px solid', 
                                marginBottom: '10px', 
                                color: 'white', 
                                backgroundColor: 'transparent', 
                                position: 'relative', 
                                width: '100%', 
                                lineHeight: '1.2', 
                                height: '45px', 
                                display: 'block', 
                                fontSize: '16px', 
                                padding: '0 5px 0 5px'
                            }}
                        />
                    }
                    </div>
         
                    <br/>

                    {/* Profile Image Heading */}
                    <div 
                        style={{
                            marginTop: '30px', 
                            width: '100%'
                        }}>
                        <h4>Profile Image</h4>
                    </div>

                    {/* Upload, crop/resize and preview squares */}
                    <div 
                        style={{
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '100%', 
                            height: '400px'
                        }}>

                        {/* Upload */}
                        <div 
                            style={{
                                width: '33%', 
                                paddingRight: '20px', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <h4>Upload</h4>
                        </div>

                        {/* Crop and resize */}
                        <div 
                            style={{
                                width: '33%', 
                                paddingRight: '20px', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <h4>Crop & Resize</h4>
                        </div>

                        {/* Preview */}
                        <div 
                            style={{
                                width: '34%', 
                                paddingRight: '20px', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <h4>Preview</h4>
                        </div>

                        {/* Drop zone (import photo) */}
                        <div 
                            style={{
                                width: '33%', 
                                paddingRight: '20px', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}
                        >
                            <PhotoWidgetDropZone setFiles={setFiles}/>
                        </div>

                        {/* Crop photo */}
                        <div 
                            style={{
                                width: '33%', 
                                paddingRight: '20px', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}
                            >
                            {
                                files && files.length > 0 && (
                                    <PhotoWidgetCropper 
                                        setCropper={setCropper} 
                                        imagePreview={files[0].preview} 
                                    />
                                )
                            }
                        </div>

                        {/* Preview photo */}
                        <div 
                            className='img-preview' 
                            style={{
                                minHeight: '300px', 
                                width: '34%', 
                                overflow: 'hidden'
                            }}
                            >
                        </div>
                        
                    </div>
                    
                </div>

                {/* Upload button */}
                <div 
                    style={{
                        clear: 'both', 
                        width: '100%',
                        display: 'inline-block'
                    }}>
                    {files && files.length > 0 && (
                        <>
                            <Button 
                                disabled={uploading} 
                                floated='right' 
                                onClick={() => setFiles([])} 
                                icon='close'
                                />
                            <Button 
                                loading={uploading}  
                                floated='right' 
                                color='blue' 
                                onClick={onCrop} 
                                icon='check' 
                                />
                        </>
                    )}
                </div>
            </div>
        )
})