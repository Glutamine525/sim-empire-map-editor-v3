import React, { FC } from 'react';
import {
  Button,
  Drawer,
  Message,
  Modal,
  Table,
  TableColumnProps,
  Tooltip,
} from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import Image from 'next/image';
import { shallow } from 'zustand/shallow';
import { encodeMapData, importMapData } from '@/utils/import-export';
import { CivilTypeLabel } from '../../_map-core/type';
import { useAutoSave } from '../../_store/auto-save';
import { useCommand } from '../../_store/command';
import { useSetting } from '../../_store/settings';
import styles from './index.module.css';

interface AutoSaveDrawerProps {
  visible: boolean;
  close: () => void;
}

const AutoSaveDrawer: FC<AutoSaveDrawerProps> = props => {
  const { visible, close } = props;

  const resetCommand = useCommand(state => state.reset);
  const [mapData, snapshots, moveSelectedToFirst] = useAutoSave(
    state => [state.mapData, state.snapshots, state.moveSelectedToFirst],
    shallow,
  );
  const limit = useSetting(state => state.autoSaveMaxNum);

  const columns: TableColumnProps[] = [
    {
      title: '地图',
      dataIndex: 'mapType',
      align: 'center',
    },
    {
      title: '文明',
      dataIndex: 'civil',
      align: 'center',
    },
    {
      title: '无木',
      dataIndex: 'noTree',
      align: 'center',
    },
    {
      title: '建筑数量',
      dataIndex: 'buildingNum',
      align: 'center',
    },
    {
      title: '道路数量',
      dataIndex: 'roadNum',
      align: 'center',
    },
    {
      title: '存档时间',
      dataIndex: 'createAt',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, { imgSrc, originData }, index) => {
        const isCurrentMap = mapData?.md5 === originData.md5;
        return (
          <Tooltip
            position="br"
            color="var(--color-bg-5)"
            content={
              isCurrentMap ? (
                '当前地图，禁止载入'
              ) : (
                <Image
                  alt="缩略图"
                  src={imgSrc}
                  width={320}
                  height={320}
                  style={{ display: 'block' }}
                />
              )
            }
          >
            <Button
              size="mini"
              type="text"
              disabled={isCurrentMap}
              style={{ padding: '0 4px' }}
              onClick={async () => {
                const isOk = await new Promise<boolean>(resolve => {
                  Modal.confirm({
                    title: '提示',
                    content:
                      '加载完成后，所有历史操作将被清空，是否确认载入该存档？',
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
                const { imgSrc: _, ...data } = originData;
                moveSelectedToFirst(index);
                importMapData(encodeMapData(data));
                resetCommand();
                Message.success('成功载入该存档！');
                close();
              }}
            >
              载入
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Drawer
      width={640}
      wrapClassName={styles.container}
      title={
        <div className={styles.title}>
          <strong>自动存档</strong>
          <div>
            <strong>{snapshots.length}</strong>
            <span className={styles.limit}>/{limit}</span>
          </div>
        </div>
      }
      visible={visible}
      focusLock={false}
      onCancel={() => {
        close();
      }}
      footer={null}
    >
      <Table
        columns={columns}
        pagination={false}
        data={snapshots.map((v, i) => ({
          key: i,
          mapType: `${v.mapType}木`,
          civil: CivilTypeLabel[v.civil],
          noTree: v.noTree ? <IconCheck /> : <IconClose />,
          buildingNum: Object.values(v.buildings).reduce(
            (pre, cur) => pre + cur.length,
            0,
          ),
          roadNum: v.roads.length,
          createAt: dayjs(v.createAt).format('HH:mm:ss'),
          imgSrc: v.imgSrc,
          originData: v,
        }))}
      />
    </Drawer>
  );
};

export default AutoSaveDrawer;
