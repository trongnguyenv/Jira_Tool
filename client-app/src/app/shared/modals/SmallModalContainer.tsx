import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { Modal } from 'semantic-ui-react';

export default observer(function SmallModalContainer() {
    const {smallModalStore} = useStore();

    return (
        <Modal open={smallModalStore.smallModal.open} 
               onClose={smallModalStore.closeSmallModal} 
               size='mini'>
            <Modal.Content>
                {smallModalStore.smallModal.body}
            </Modal.Content>
        </Modal>
    )
})


