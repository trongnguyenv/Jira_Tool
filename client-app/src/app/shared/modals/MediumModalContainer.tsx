import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { Modal } from 'semantic-ui-react';

export default observer(function MediumModalContainer() {
    const {mediumModalStore} = useStore();

    return (
        <Modal open={mediumModalStore.mediumModal.open} 
               onClose={mediumModalStore.closeMediumModal} 
               size='small'>
            <Modal.Content>
                {mediumModalStore.mediumModal.body}
            </Modal.Content>
        </Modal>
    )
})


