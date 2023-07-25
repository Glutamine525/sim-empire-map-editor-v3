import React, { FC } from 'react';
import { Modal, Tag, Tooltip } from '@arco-design/web-react';
import { useSpecialBuilding } from '../../_store/special-building';
import CustomBuildingEditor from '../custom-building-editor';
import styles from './index.module.css';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';

interface SpecialBuildingModalProps {
  visible: boolean;
  close: () => void;
}

const SpecialBuildingModal: FC<SpecialBuildingModalProps> = props => {
  const { visible, close } = props;
  const { buildings, isNameValid, insert, remove } = useSpecialBuilding();

  return (
    <Modal
      visible={visible}
      footer={null}
      focusLock={false}
      className={styles.wrapper}
      onCancel={() => {
        close();
      }}>
      <CustomBuildingEditor isNameValid={isNameValid} insert={insert}>
        <div className={styles.tags}>
          {Object.values(buildings).map(v => (
            <Tooltip
              key={v.name}
              position="top"
              trigger="hover"
              content={
                <div>
                  <div>显示名称: {v.text}</div>
                  <div>宽度: {v.w}格</div>
                  <div>高度: {v.h}格</div>
                  <div>范围: {v.range}格</div>
                  <div>
                    美化:{' '}
                    <span
                      style={{
                        color: v.isDecoration
                          ? 'rgb(var(--success-6))'
                          : 'rgb(var(--danger-6))',
                      }}>
                      {v.isDecoration ? <IconCheck /> : <IconClose />}
                    </span>
                  </div>
                </div>
              }>
              <Tag
                color={v.bg}
                bordered={true}
                closable={true}
                style={{ color: v.color }}
                onClose={() => {
                  remove(v.name);
                }}>
                {v.name}
              </Tag>
            </Tooltip>
          ))}
        </div>
      </CustomBuildingEditor>
    </Modal>
  );
};

export default SpecialBuildingModal;
