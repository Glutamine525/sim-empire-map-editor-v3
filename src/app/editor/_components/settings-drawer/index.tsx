import React, { FC } from 'react';
import { Drawer, Form, Radio, Slider, Switch } from '@arco-design/web-react';
import styles from './index.module.css';

const { Item: FormItem, useForm } = Form;

interface SettingsDrawerProps {
  visible: boolean;
  close: () => void;
}

const SettingsDrawer: FC<SettingsDrawerProps> = props => {
  const { visible, close } = props;

  const [form] = useForm();

  return (
    <Drawer
      width={640}
      title={<strong>设置</strong>}
      visible={visible}
      focusLock={false}
      onCancel={() => {
        close();
      }}
    >
      <Form form={form}>
        <div className={styles['sub-title']}>键盘快捷键</div>
        <FormItem label="顶部菜单" field="enableTopMenuShortcut">
          <Switch />
        </FormItem>
        <FormItem label="侧边菜单" field="enableLeftMenuShortcut">
          <Switch />
        </FormItem>
        <FormItem label="地图区域" field="enableInteractLayerShortcut">
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>鼠标操作</div>
        <FormItem label="双击删除" field="enableDoubleClickDelete">
          <Switch />
        </FormItem>
        <FormItem label="查询住宅需求" field="enableResidenceRequirementQuery">
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>存档</div>
        <FormItem label="自动存档间隔" field="autoSaveInterval">
          <Slider />
        </FormItem>
        <FormItem label="最大存档数" field="autoSaveMaxNum">
          <Slider />
        </FormItem>

        <div className={styles['sub-title']}>样式</div>
        <FormItem label="道路计数" field="roadCountStyle">
          <Radio.Group options={['A', 'B']} />
        </FormItem>
        <FormItem label="防护计数" field="protectionCountStyle">
          <Radio.Group options={['A', 'B']} />
        </FormItem>
        <FormItem label="固定建筑标记" field="enableFixedBuildingIcon">
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>历史操作</div>
        <FormItem label="最大历史操作数" field="commandMaxNum">
          <Slider />
        </FormItem>
        <FormItem label="开启载入操作" field="enableLoadCommand">
          <Switch />
        </FormItem>
        <FormItem label="存储操作" field="enableCommandStoredInDb">
          <Switch />
        </FormItem>

        <div className={styles['sub-title']}>截图</div>
        <FormItem label="像素缩放" field="screenshotScale">
          <Slider />
        </FormItem>
        <FormItem label="图片质量" field="screenshotQuality">
          <Slider />
        </FormItem>

        <div className={styles['sub-title']}>兼容模式</div>
        <FormItem label="城市与文明" field="enableCivilAndCityMode">
          <Switch />
        </FormItem>
      </Form>
    </Drawer>
  );
};

export default SettingsDrawer;
