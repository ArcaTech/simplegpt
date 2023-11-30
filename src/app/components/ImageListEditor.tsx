import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { MessageImage } from '../../types/chat';

export interface ImageListEditorProps {
    images: MessageImage[];
    onRemoveImage: (name: string) => void;
}

export default function ImageListEditor({
	images,
    onRemoveImage,
}: ImageListEditorProps) {
	return (
        <div className="image-list my-2">
            {images.map(image => {
                return (
                    <div className="card" key={image.url}>
                        <div className="card-image">
                            <figure className="image">
                                <img src={image.url} />
                            </figure>
                        </div>
                        <footer className="card-footer">
                            <a onClick={e => onRemoveImage(image.url)} className="card-footer-item">
                                <FontAwesomeIcon icon={faTrashCan} size="sm" />
                            </a>
                        </footer>
                    </div>
                );
            })}
        </div>
	)
}
