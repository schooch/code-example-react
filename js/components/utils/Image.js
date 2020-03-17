import React from 'react';
import OnImagesLoaded from 'react-on-images-loaded';
import LoadingSVG from '../../../images/loading.svg';

class Image extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoaded: false
    }
  }
  onLoad() {
    this.setState({ isLoaded: true });
  }

  render() {
    const { parentClass, src, className, background, style, ...rest } = this.props;
    const { isLoaded } = this.state;
    const restIfLoaded = isLoaded && src ? {} : { ...rest };
    return (
      <React.Fragment>
        {
          background ?
          <React.Fragment>
            {
              !src ?
              <div
                {...rest}
                className={`${className} placeholder`}
                style={{ backgroundImage: `url('${LoadingSVG}')`, ...style }}></div>
              :
              <React.Fragment>
                {
                  !isLoaded &&
                    <div className={`${className} background placeholder-loading`} {...rest}style={style}>
                    <img
                      src={LoadingSVG}
                    />
                  </div>
                }
                <OnImagesLoaded
                  onLoaded={this.onLoad.bind(this)}
                  >
                  <div
                    {...rest}
                    className={`${className} ${isLoaded ? '' : 'image-hidden'}`}
                    style={{ backgroundImage: `url('${src}')`, ...style }}></div>
                </OnImagesLoaded>
              </React.Fragment>
            }
          </React.Fragment>
          :
            <div className={`${parentClass} ${isLoaded ? '' : 'placeholder-in'}`}
            {...restIfLoaded}>
            {
              !src ?
              <img
                {...rest}
                src={LoadingSVG}
                ref="placeholder"
                style={style}
                className={`${className} placeholder`}
              />
              :
              <React.Fragment>
                {
                  !isLoaded &&
                  <img
                    src={LoadingSVG}
                    style={style}
                    className={`${className} placeholder-loading`}
                  />
                }
                <OnImagesLoaded
                  onLoaded={this.onLoad.bind(this)}>
                  <img
                    {...rest}
                    src={src}
                    ref="image"
                    className={`${className} ${isLoaded ? '': 'image-hidden'}`}
                    style={style}
                  />
                </OnImagesLoaded>
              </React.Fragment>
            }
          </div>
        }
        
      </React.Fragment>
    );
  }
}

export default Image;