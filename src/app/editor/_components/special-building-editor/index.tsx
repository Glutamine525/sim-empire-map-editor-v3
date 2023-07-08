import React, { FC, ReactNode, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Input,
  InputNumber,
  Switch,
} from '@arco-design/web-react';
import { BuildingConfig } from '@/map-core/building';
import { BLOCK_PX } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import Block from '../block';
import Building from '../building';
import ColorPicker from '../color-picker';
import styles from './index.module.css';

const FormItem = Form.Item;

interface SpecialBuildingEditorProps {
  isNameValid: (name: string) => boolean;
  insert: (b: BuildingConfig) => void;
  children?: ReactNode;
}

const SpecialBuildingEditor: FC<SpecialBuildingEditorProps> = props => {
  const { isNameValid, insert, children } = props;

  const mapCore = useMapCore();

  const [form] = Form.useForm();

  const [marker, setMarker] = useState(0);
  const [config, setConfig] = useState<BuildingConfig>({
    name: '花坛',
    text: '花坛',
    w: 3,
    h: 3,
    color: '#000000',
    bg: '#9fff6b',
    isDecoration: true,
  });

  const size = useMemo(() => {
    const { w = 1, h = 1 } = config;
    const max = Math.max(w, h);
    if (max < 7) {
      return { w: 11, h: 11 };
    }
    return { w: max + 4, h: max + 4 };
  }, [config]);

  return (
    <div className={styles.container}>
      <div
        className={styles['preview-container']}
        style={{
          width: (size.w - 1) * BLOCK_PX,
          height: (size.h - 1) * BLOCK_PX,
        }}
      >
        <div className={styles.preview}>
          {Array(size.h)
            .fill(1)
            .map((_, row) =>
              Array(size.h)
                .fill(1)
                .map((_, col) => (
                  <Block key={row + '-' + col} row={row + 1} col={col + 1} />
                )),
            )}
          <Building
            {...config}
            marker={marker}
            row={Math.floor(size.h / 2 - config.h! / 2) + 1}
            col={Math.floor(size.w / 2 - config.w! / 2) + 1}
          />
        </div>
      </div>
      <div className={styles['button-container']}>
        <Button
          status="danger"
          onClick={() => {
            setMarker(0);
          }}
        >
          防护未满
        </Button>
        <Button
          status="success"
          onClick={() => {
            setMarker(mapCore.protection.length);
          }}
        >
          防护已满
        </Button>
      </div>
      {children}
      <Form
        form={form}
        className={styles.form}
        validateMessages={{
          required: (_, { label }) => `必须填写 ${label}`,
        }}
        onValuesChange={(_, v) => {
          setConfig(v);
        }}
        onSubmit={v => {
          insert(v);
        }}
      >
        <FormItem
          label="建筑名字"
          field="name"
          initialValue="花坛"
          rules={[
            {
              required: true,
              validator: (v, cb) => {
                if (!v) {
                  cb(<div role="alert">必须填写 建筑名字</div>);
                  return;
                }
                if (v.length > 10) {
                  cb(<div role="alert">建筑名字 长度必须≤10</div>);
                  return;
                }
                if (!isNameValid(v)) {
                  cb(
                    <div role="alert">该名字已经被占用，或者含有特殊字符</div>,
                  );
                  return;
                }
              },
            },
          ]}
        >
          <Input allowClear={true} />
        </FormItem>
        <FormItem
          label="显示名字"
          field="text"
          initialValue="花坛"
          rules={[
            {
              validator: (v, cb) => {
                if ((v?.length || 0) > 10) {
                  cb(<div role="alert">显示名字 长度必须≤10</div>);
                }
              },
            },
          ]}
        >
          <Input allowClear={true} />
        </FormItem>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item
              label="宽度"
              field="w"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue={3}
            >
              <InputNumber mode="button" min={1} max={20} />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item
              label="高度"
              field="h"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue={3}
            >
              <InputNumber mode="button" min={1} max={20} />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item
              label="文字颜色"
              field="color"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue="#000000"
            >
              <ColorPicker />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item
              label="背景颜色"
              field="bg"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue="#9fff6b"
            >
              <ColorPicker />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item
              label="范围"
              field="range"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue={0}
            >
              <InputNumber mode="button" min={0} max={20} />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item
              label="美化"
              field="isDecoration"
              triggerPropName="checked"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <div className={styles['button-container']}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SpecialBuildingEditor;
