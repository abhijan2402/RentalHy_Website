import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  message,
} from "antd";
import {
  useGetAccountListQuery,
  useSaveAccountMutation,
} from "../redux/api/accountApi";

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch account using RTK Query
  const { data: accountData, isLoading } = useGetAccountListQuery();
  const [saveAccount, { isLoading: isUpdating }] = useSaveAccountMutation();

  // Correctly get the first account if API returns array
  const account = accountData?.data?.[0] || null;

  useEffect(() => {
    // Whenever modal opens, populate form with current account values
    if (isModalOpen && account) {
      form.setFieldsValue(account);
    }
  }, [isModalOpen, account, form]);

  const handleUpdate = async (values) => {
    try {
      // Send values as JSON, no need for FormData unless backend strictly requires it
      await saveAccount(values).unwrap();
      message.success("Account updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update account");
      console.error(error);
    }
  };

//   if (isLoading) return <Spin />;

  return (
    <Card title="Bank Account Details" bordered>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Account Number">
          {account?.account_number || "No account number available"}
        </Descriptions.Item>
        <Descriptions.Item label="Account Holder Name">
          {account?.account_holder_name || "No holder name available"}
        </Descriptions.Item>
        <Descriptions.Item label="IFSC Code">
          {account?.ifsc_code || "No IFSC code available"}
        </Descriptions.Item>
        <Descriptions.Item label="Branch">
          {account?.branch || "No branch available"}
        </Descriptions.Item>
        <Descriptions.Item label="Account Type">
          {account?.account_type || "No account type available"}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-4 text-right">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Update Details
        </Button>
      </div>

      <Modal
        title="Update Account Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="account_number"
            label="Account Number"
            rules={[{ required: true, message: "Please enter account number" }]}
          >
            <Input placeholder="Enter account number" />
          </Form.Item>
          <Form.Item
            name="account_holder_name"
            label="Account Holder Name"
            rules={[
              { required: true, message: "Please enter account holder name" },
            ]}
          >
            <Input placeholder="Enter account holder name" />
          </Form.Item>
          <Form.Item
            name="ifsc_code"
            label="IFSC Code"
            rules={[{ required: true, message: "Please enter IFSC code" }]}
          >
            <Input placeholder="Enter IFSC code" />
          </Form.Item>
          <Form.Item
            name="branch"
            label="Branch"
            rules={[{ required: true, message: "Please enter branch name" }]}
          >
            <Input placeholder="Enter branch name" />
          </Form.Item>
          <Form.Item
            name="account_type"
            label="Account Type"
            rules={[{ required: true, message: "Please enter account type" }]}
          >
            <Input placeholder="Enter account type" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isUpdating} block>
            Save Changes
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default Account;
