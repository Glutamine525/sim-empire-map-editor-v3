import React, { FC } from 'react';
import { Message, Modal, Upload } from '@arco-design/web-react';
import { importMapData } from '@/utils/import-export';
import useMapCore from '../../_hooks/use-map-core';
import { useAutoSave } from '../../_store/auto-save';
import { resetBuildingData } from '../../_store/building-data';
import { useCommand } from '../../_store/command';
import styles from './index.module.css';

const ACCEPT = '.txt';

export enum ImportDataModalType {
  None,
  Civil,
  Map,
}

interface ImportDataModalProps {
  type: ImportDataModalType;
  setType: (v: ImportDataModalType) => void;
}

const ImportDataModal: FC<ImportDataModalProps> = props => {
  const { type, setType } = props;

  const mapCore = useMapCore();
  const resetCommand = useCommand(state => state.reset);
  const trigger = useAutoSave(state => state.trigger);

  const handler = async (file: File) => {
    const fileExtension =
      file.name.indexOf('.') > -1 ? file.name.split('.').pop() : '';
    if (fileExtension !== ACCEPT.slice(1)) {
      Message.error('不接受的文件类型，请重新上传指定文件类型~');
      return;
    }
    if (mapCore.hasPlacedBuilding()) {
      const isOk = await new Promise<boolean>(resolve => {
        Modal.confirm({
          title: '提示',
          content: '加载完成后，所有历史操作将被清空，是否确认载入该存档？',
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
      if (!isOk) {
        return;
      }
    }
    const data = await new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve((e.target?.result as string) || '');
      };
      reader.readAsText(file);
    });
    if (type === ImportDataModalType.Map) {
      resetBuildingData();
      const succeed = importMapData(data);
      if (!succeed) {
        Message.error('该存档已损坏，导入失败！');
        return;
      }
      Message.success('成功载入该存档！');
      resetCommand();
      trigger();
      setType(ImportDataModalType.None);
    }
  };

  return (
    <Modal
      visible={type !== ImportDataModalType.None}
      footer={null}
      closable={false}
      focusLock={false}
      className={styles.container}
      onCancel={() => {
        setType(ImportDataModalType.None);
      }}
    >
      <Upload
        drag={true}
        accept={ACCEPT}
        showUploadList={false}
        beforeUpload={file => {
          handler(file);
          return false;
        }}
        // onDrop={e => {
        //   const file = e.dataTransfer.files[0];
        //   handler(file);
        // }}
      />
    </Modal>
  );
};

export default ImportDataModal;
