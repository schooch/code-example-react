import React from 'react';
import { asField } from 'informed';
import PhotoSvg from '../../../../images/photo.svg';

const ImageInput = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState;
  const { setValue, setTouched } = fieldApi;
  const { onChange, initialValue, forwardedRef, logo, ...rest } = props;
  const imageValue =
    value === undefined ?
      null : value && typeof value === 'object' && value && value !== undefined ?
      URL.createObjectURL(value) : value ?
      value : initialValue ?
      initialValue : null;
  return (
    <React.Fragment>
      <label className={`upload-button ${logo && 'image-mask-wrapper'}`}>
        {logo ?
          <React.Fragment>
            <div className="image-mask" style={{ backgroundImage: `url('${imageValue}')` }}>
            </div>
            <div className="icon">
              <img src={PhotoSvg} alt="" />
            </div>
          </React.Fragment> :
          <div className="image-holder">
            <img className="image" src={imageValue} alt="" />
            <div className="icon">
              <img src={PhotoSvg} alt="" />
            </div>
          </div>
        }
        <input
          {...rest}
          ref={forwardedRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={e => {
            setTouched();
            setValue(e.target.files[0]);
            if (onChange) {
              onChange(e.target.files[0]);
            }
          }} />
      </label>
    </React.Fragment>
  );
});

export default ImageInput;