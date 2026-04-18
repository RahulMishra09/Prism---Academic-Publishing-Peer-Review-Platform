import type { Meta, StoryObj } from '@storybook/react';
import {
    Modal,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalFooter,
    ModalClose,
} from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
    title: 'Shared/UI/Modal',
    component: Modal,
};
export default meta;

export const Default: StoryObj<typeof Modal> = {
    render: () => (
        <Modal>
            <ModalTrigger asChild>
                <Button variant="outline">Open Modal</Button>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Edit profile</ModalTitle>
                    <ModalDescription>
                        Make changes to your profile here. Click save when you're done.
                    </ModalDescription>
                </ModalHeader>
                <div className="py-4">
                    {/* Content placeholder */}
                    <p className="text-sm">Profile form would go here.</p>
                </div>
                <ModalFooter>
                    <ModalClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </ModalClose>
                    <Button type="submit">Save changes</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    ),
};
