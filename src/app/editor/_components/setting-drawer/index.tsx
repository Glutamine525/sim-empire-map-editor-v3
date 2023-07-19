import React, { FC } from 'react';
import { Drawer, Form, Radio, Slider, Switch } from '@arco-design/web-react';
import { useSetting } from '../../_store/settings';
import styles from './index.module.css';

const { Item: FormItem, useForm } = Form;

interface SettingDrawerProps {
  visible: boolean;
  close: () => void;
}

const SettingDrawer: FC<SettingDrawerProps> = props => {
  const { visible, close } = props;

  const { setSetting, ...setting } = useSetting();

  const [form] = useForm();

  return (
    <Drawer
      width={640}
      title={<strong>设置</strong>}
      visible={visible}
      focusLock={false}
      footer={null}
      onCancel={() => {
        setSetting(form.getFields());
        close();
      }}
    >
      <Form
        form={form}
        initialValues={setting}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
      >
        <div className={styles['sub-title']}>键盘快捷键</div>
        <FormItem
          disabled={true}
          label="顶部菜单"
          field="enableTopMenuShortcut"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          disabled={true}
          label="侧边菜单"
          field="enableLeftMenuShortcut"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          disabled={true}
          label="地图区域"
          field="enableInteractLayerShortcut"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>鼠标操作</div>
        <FormItem
          label="双击删除"
          field="enableDoubleClickDelete"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          label="查询住宅需求"
          field="enableResidenceRequirementQuery"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>存档</div>
        <FormItem label="自动存档间隔" field="autoSaveInterval">
          <Slider
            min={10}
            max={60}
            step={5}
            marks={{
              10: '10s',
              20: '20s',
              30: '30s',
              40: '40s',
              50: '50s',
              60: '60s',
            }}
          />
        </FormItem>
        <FormItem label="最大存档数" field="autoSaveMaxNum">
          <Slider
            min={10}
            max={30}
            step={1}
            marks={{ 10: 10, 15: 15, 20: 20, 25: 25, 30: 30 }}
          />
        </FormItem>

        <div className={styles['sub-title']}>样式</div>
        <FormItem disabled={true} label="道路计数" field="roadCountStyle">
          <Radio.Group options={['A', 'B']} />
        </FormItem>
        <FormItem disabled={true} label="防护计数" field="protectionCountStyle">
          <Radio.Group options={['A', 'B']} />
        </FormItem>
        <FormItem
          label="固定建筑标记"
          field="enableFixedBuildingIcon"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          label="防护建筑高亮"
          field="enableProtectionHighlight"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>历史操作</div>
        <FormItem disabled={true} label="最大历史操作数" field="commandMaxNum">
          <Slider
            min={100}
            max={500}
            step={50}
            marks={{ 100: 100, 200: 200, 300: 300, 400: 400, 500: 500 }}
          />
        </FormItem>
        <FormItem
          disabled={true}
          label="开启载入操作"
          field="enableLoadCommand"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          disabled={true}
          label="存储操作"
          field="enableCommandStoredInDb"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>截图</div>
        <FormItem label="像素缩放" field="screenshotScale">
          <Slider
            min={1}
            max={3}
            step={0.5}
            marks={{ 1: '1x', 2: '2x', 3: '3x' }}
          />
        </FormItem>
        <FormItem label="图片质量" field="screenshotQuality">
          <Slider
            min={0.2}
            max={1}
            step={0.1}
            marks={{ 0.2: 0.2, 0.4: 0.4, 0.6: 0.6, 0.8: 0.8, 1: 1 }}
          />
        </FormItem>

        <div className={styles['sub-title']}>兼容模式</div>
        <FormItem
          disabled={true}
          label="城市与文明"
          field="enableCityAndCivilMode"
          triggerPropName="checked"
        >
          <Switch />
        </FormItem>
      </Form>
    </Drawer>
  );
};

export default SettingDrawer;
