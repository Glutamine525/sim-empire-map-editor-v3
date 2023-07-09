import React, { FC } from 'react';
import {
  Button,
  Drawer,
  Table,
  TableColumnProps,
  Tooltip,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { CivilTypeLabel } from '../../_map-core/type';
import { useAutoSave } from '../../_store/auto-save';

interface AutoSaveDrawerProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const AutoSaveDrawer: FC<AutoSaveDrawerProps> = props => {
  const { visible, setVisible } = props;

  const snapshots = useAutoSave(state => state.snapshots);

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
      render: (_, { imgSrc, originData }) => (
        <Tooltip
          position="br"
          color="var(--color-bg-5)"
          content={
            <Image
              alt="缩略图"
              src={imgSrc}
              width={160}
              height={160}
              style={{ display: 'block' }}
            />
          }
        >
          <Button
            size="mini"
            type="text"
            onClick={() => {
              const { imgSrc: _, ...data } = originData;
              console.log(data);
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
          buildingNum: Object.keys(v.buildings).length,
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
