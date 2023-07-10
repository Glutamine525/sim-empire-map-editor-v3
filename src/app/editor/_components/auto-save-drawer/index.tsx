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
import dayjs from 'dayjs';
import Image from 'next/image';
import { shallow } from 'zustand/shallow';
import {
  decodeMapData,
  encodeMapData,
  importMapData,
} from '@/utils/import-export';
import useMapCore from '../../_hooks/use-map-core';
import { CivilTypeLabel } from '../../_map-core/type';
import { useAutoSave } from '../../_store/auto-save';
import { resetBuildingData } from '../../_store/building-data';
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';

interface AutoSaveDrawerProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const AutoSaveDrawer: FC<AutoSaveDrawerProps> = props => {
  const { visible, setVisible } = props;

  const resetCommand = useCommand(state => state.reset);
  const mapCore = useMapCore();
  const [changeMapType, changeCivil, changeNoTree] = useMapConfig(
    state => [state.changeMapType, state.changeCivil, state.changeNoTree],
    shallow,
  );
  const [mapDataStr, snapshots, moveSelectedToFirst] = useAutoSave(
    state => [state.mapDataStr, state.snapshots, state.moveSelectedToFirst],
    shallow,
  );

  const columns: TableColumnProps[] = [
    {
      title: '地图',
      dataIndex: 'mapType',
    },
    {
      title: '文明',
      dataIndex: 'civil',
    },
    {
      title: '无木',
      dataIndex: 'noTree',
    },
    {
      title: '建筑数量',
      dataIndex: 'buildingNum',
    },
    {
      title: '道路数量',
      dataIndex: 'roadNum',
    },
    {
      title: '存档时间',
      dataIndex: 'createAt',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, { imgSrc, originData }, index) => (
        <Tooltip
          position="br"
          color="var(--color-bg-5)"
          content={
            <Image
              alt="缩略图"
              src={imgSrc}
              width={320}
              height={320}
              style={{ display: 'block' }}
            />
          }
        >
          <Button
            size="mini"
            type="text"
            onClick={async () => {
              if (decodeMapData(mapDataStr).md5 === originData.md5) {
                Message.warning('载入失败，该存档和当前地图数据一致！');
                return;
              }
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
              console.log(data);
              moveSelectedToFirst(index);
              resetBuildingData();
              importMapData(encodeMapData(data), (mapType, civil, noTree) => {
                changeMapType(mapType);
                changeCivil(civil);
                mapCore.toggleNoTree(noTree);
                changeNoTree(noTree);
                resetCommand();
                Message.success('成功载入该存档！');
                setVisible(false);
              });
            }}
          >
            载入
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Drawer
      width={640}
      title={<span>自动存档</span>}
      visible={visible}
      onOk={() => {
        setVisible(false);
      }}
      onCancel={() => {
        setVisible(false);
      }}
      footer={null}
    >
      <Table
        columns={columns}
        pagination={false}
        data={snapshots.map((v, i) => ({
          key: i,
          mapType: v.mapType,
          civil: CivilTypeLabel[v.civil],
          noTree: v.noTree ? '√' : '×',
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
