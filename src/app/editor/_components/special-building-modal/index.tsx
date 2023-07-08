import React, { FC } from 'react';
import { Modal, Tag, Tooltip } from '@arco-design/web-react';
import { useSpecialBuilding } from '../../_store/special-building';
import SpecialBuildingEditor from '../special-building-editor';
import styles from './index.module.css';

interface SpecialBuildingModalProps {}

const SpecialBuildingModal: FC<SpecialBuildingModalProps> = props => {
  const {
    show,
    buildings,
    setShow,
    isNameValid,
    insertBuilding,
    deleteBuilding,
  } = useSpecialBuilding();

  return (
    <Modal
      visible={show}
      footer={null}
      className={styles.wrapper}
      onCancel={() => {
        setShow(false);
      }}
    >
      <SpecialBuildingEditor isNameValid={isNameValid} insert={insertBuilding}>
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
                          ? 'rgb(var(--success-5))'
                          : 'rgb(var(--danger-5))',
                      }}
                    >
                      {v.isDecoration ? '√' : 'x'}
                    </span>
                  </div>
                </div>
              }
            >
              <Tag
                color={v.bg}
                bordered={true}
                closable={true}
                style={{ color: v.color }}
                onClose={() => {
                  deleteBuilding(v.name);
                }}
              >
                {v.name}
              </Tag>
            </Tooltip>
          ))}
        </div>
      </SpecialBuildingEditor>
    </Modal>
  );
};

export default SpecialBuildingModal;
