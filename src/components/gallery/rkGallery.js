import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, StyleSheet } from 'react-native';
import { RkComponent } from '../rkComponent';
import { RkGalleryGrid } from './rkGalleryGrid';
import { RkGalleryViewer } from './rkGalleryViewer';
import { RkGalleryHeaderFooter } from './RkGalleryHeaderFooter';
import { RkButton } from '../button/rkButton';

export class RkGallery extends RkComponent {
  static propTypes = {
    items: RkGalleryGrid.propTypes.items,
    previewIndex: PropTypes.number,
    renderGalleryHeader: RkGalleryHeaderFooter.propTypes.onRenderComponent,
    gridSpanCount: RkGalleryGrid.propTypes.spanCount,
    gridItemMargin: RkGalleryGrid.propTypes.itemMargin,
    galleryItemMaxScale: RkGalleryViewer.propTypes.itemMaxScale,
    onGridItemClick: RkGalleryGrid.propTypes.onItemClick,
    onGalleryItemClick: RkGalleryViewer.propTypes.onItemClick,
    onGalleryItemChange: RkGalleryViewer.propTypes.onItemChange,
    onGalleryItemScaleChange: RkGalleryViewer.propTypes.onItemScaleChange,
  };
  static defaultProps = {
    renderGalleryHeader: null,
    gridSpanCount: RkGalleryGrid.defaultProps.spanCount,
    gridItemMargin: RkGalleryGrid.defaultProps.itemMargin,
  };
  componentName = 'RkGallery';

  state = {
    previewImageIndex: undefined,
  };

  onModalRequestClose = () => {
    const change = {
      previous: this.state.previewImageIndex,
      current: undefined,
    };
    this.setState({
      previewImageIndex: change.current,
    });
    this.props.onGalleryItemChange(change);
  };

  onViewerItemChange = (change) => {
    this.state.previewImageIndex = change.current;
    this.props.onGalleryItemChange(change);
  };

  onGridItemClick = (item, index) => {
    const change = {
      previous: this.state.previewImageIndex,
      current: index,
    };
    this.setState({
      previewImageIndex: change.current,
    });
    this.props.onGalleryItemChange(change);
    this.props.onGridItemClick(item, index);
  };

  renderViewerHeader = () => (
    <View style={styles.viewerHeader}>
      <RkButton
        rkType='clear'
        onPress={this.onModalRequestClose}
      >
        Close
      </RkButton>
    </View>
  );

  renderViewer = () => {
    const onRenderHeader = this.props.renderGalleryHeader || this.renderViewerHeader;
    this.state.previewImageIndex = this.state.previewImageIndex || (this.props.previewIndex || 0);
    return (
      <Modal onRequestClose={this.onModalRequestClose}>
        <View style={styles.containerViewer}>
          <RkGalleryViewer
            initialIndex={this.state.previewImageIndex}
            items={this.props.items}
            itemMaxScale={this.props.galleryItemMaxScale}
            onItemClick={this.props.onGalleryItemClick}
            onItemChange={this.onViewerItemChange}
            onItemScaleChange={this.props.onGalleryItemScaleChange}
          />
          <RkGalleryHeaderFooter onRenderComponent={onRenderHeader} />
        </View>
      </Modal>
    );
  };

  renderGrid = () => (
    <RkGalleryGrid
      items={this.props.items}
      spanCount={this.props.gridSpanCount}
      itemMargin={this.props.gridItemMargin}
      onItemClick={this.onGridItemClick}
    />
  );

  isPreview = () => this.state.previewImageIndex !== undefined;

  render() {
    return this.isPreview() ? this.renderViewer() : this.renderGrid();
  }
}

const styles = StyleSheet.create({
  containerViewer: {
    marginTop: 20,
  },
  viewerHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
});
