import React, { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faLink, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { fetchUploadEnabled, uploadFile } from '../api';
import { MessageImage } from '../../types/chat';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

export interface AddImageControl {
    onAddImage: (image: MessageImage) => void;
}

export default function AddImageControl({ onAddImage }: AddImageControl) {
    const [urlMode, setUrlMode] = useState(false);
    const [manualUrl, setManualUrl] = useState('');
    const [uploadEnabled, setUploadEnabled] = useState(false);
	const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                setUploadEnabled(await fetchUploadEnabled());
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, []);

    const enterUrlMode = () => {
        setUrlMode(true);
    };

    const exitUrlMode = () => {
        setManualUrl('');
        setUrlMode(false);
    };

    const addManualUrl = () => {
        onAddImage({
            url: manualUrl,
            detail: 'auto',
        });
        exitUrlMode();
    };

	// OpenAI supports images as data URLs. This function
	// would get the data URL from the uploaded file and
	// add it to the list of pending images.
	// Because it's happening as an uploaded image, this
	// function isn't used.
	const addPendingImageAsDataUrl = (file: File) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			const result = reader.result;
			if (typeof result === 'string') {
				onAddImage({
					url: result,
					detail: 'auto',
				});
			}
		};

		reader.readAsDataURL(file);
	};

	const addPendingImageAsUploadedUrl = async (file: File) => {
        const response = await uploadFile(file);
        onAddImage({
            url: response.url,
            detail: 'auto',
        });
	};

	const onFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target && e.target.files) {
            setError(false);
			setUploading(true);

            try {
			    await addPendingImageAsUploadedUrl(e.target.files[0]);
            } catch (err) {
                console.error(err);
                setError(true);
            }

			setUploading(false);
		}
	};

	return (
        <div>
            {urlMode ? (
                <div>
                    <div className="field has-addons">
                        <div className="control">
                            <input
                                className="input is-small"
                                type="text"
                                name="url"
                                placeholder="https://"
                                value={manualUrl}
                                onChange={e => setManualUrl(e.target.value)} />
                        </div>
                        <div className="control">
                            <button className="button is-small is-success" onClick={e => addManualUrl()}>
                                <span className="icon"><FontAwesomeIcon icon={faFileCirclePlus} /></span>
                                <span>Add</span>
                            </button>
                        </div>
                        <div className="control">
                            <button className="button is-small is-danger" onClick={e => exitUrlMode()}>
                                <span className="icon"><FontAwesomeIcon icon={faTrashCan} /></span>
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="field has-addons">
                    <p className="control">
                        <button className="button" onClick={() => enterUrlMode()}>
                            <span className="icon"><FontAwesomeIcon icon={faLink} /></span>
                            <span>Add Image URL</span>
                        </button>
                    </p>
                    {uploadEnabled && (
                        <div className="control">
                            <div className="file">
                                <label className="file-label">
                                    <input
                                        className="file-input"
                                        type="file"
                                        name="image"
                                        disabled={uploading}
                                        onChange={onFileChanged} />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            {uploading ? (
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            ) : (
                                                <FontAwesomeIcon icon={faUpload} />
                                            )}
                                        </span>
                                        <span className="file-label">
                                            Upload image...
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
	)
}
