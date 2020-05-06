import React, { Component } from "react";
import "./index.less";
import { Icon, Toast } from "antd-mobile";
import { Nav } from "@coms";
import { testRule } from "@utils/rule";
import { upLoadImg } from "@apis/api";
import { setRealName } from "@apis/my";
import IP from "@apis/ip";
import { save_user } from "@store/action";
import { connect } from "react-redux";
class RealName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgArr: [
        {
          title: "上传身份证正面照",
          type: "positive",
        },
        {
          title: "上传身份证反面照",
          type: "reverse",
        },
      ],
      name: "",
      code: "",
      positive: "", //正面
      reverse: "", //反面
      disabled: false,
    };
  }
  componentDidMount() {
    let userdata = JSON.parse(localStorage.userdata);
    let obj = {};
    switch (userdata.certReal) {
      case 1:
        obj = {
          disabled: true,
          name: userdata.named,
          code: userdata.idCard,
          positive: userdata.idCardFront, //正面
          reverse: userdata.idCardBack, //反面
        };
        break;
      case 2:
      case 3:
        obj = {
          name: userdata.named,
          code: userdata.idCard,
          positive: userdata.idCardFront, //正面
          reverse: userdata.idCardBack, //反面
        };
        break;
    }
    this.setState(obj);
  }
  //  提交数据
  submitFn = async () => {
    let { name, code, positive, reverse, disabled } = this.state;
    if (disabled) {
      Toast.show("请勿重复提交表单");
      return;
    }
    if (!name) {
      Toast.info("请输入姓名");
      return;
    }
    if (!code || !testRule("idCard", code)) {
      Toast.info("请输入正确的身份证");
      return;
    }
    if (!positive) {
      Toast.info("请上传身份证正面照片");
      return;
    }
    if (!reverse) {
      Toast.info("请上传身份证背面照片");
      return;
    }
    let params = {
      idCard: code,
      named: name,
      idCardFront: positive,
      idCardBack: reverse,
    };
    this.setState({
      disabled: true,
    });
    try {
      await setRealName(params);
      let userdata = JSON.parse(localStorage.userdata);
      userdata = Object.assign({}, userdata, {
        ...params,
        certReal: 2,
      });
      localStorage.userdata = JSON.stringify(userdata);
      this.props.dispatch(save_user(userdata));
      Toast.success("提交认证成功", 2, () => {
        this.props.history.goBack();
      });
    } catch (error) {
      console.log(error);
      this.setState({
        disabled: false,
      });
    }
  };
  //   上传图片
  selectImg = async (file, type) => {
    if (!file) return;
    let tipArr = ["JPG", "PNG", "JPEG"];
    if (file.type.indexOf("image/") == -1) {
      Toast.info("请选择图片文件");
      return;
    }
    let tipName = file.type.split("/")[1].toUpperCase();
    if (tipArr.indexOf(tipName) === -1) {
      Toast.info("请选择JPG、PNG、JPEG格式的图片");
      return;
    }
    let formData = new FormData();
    //通过append向form对象添加数据
    formData.append("file", file);
    this.setState({
      disabled: true,
    });
    try {
      let res = await upLoadImg(formData);
      this.setState({
        [type]: res.data,
      });
    } catch (error) {
      console.log("上传失败", error);
      Toast.info("请检查网络情况再上传");
    } finally {
      this.setState({
        disabled: false,
      });
    }
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = (e) => {
    //   this.setState({
    //     [type]: e.target.result,
    //   });
    // };
  };
  render() {
    let { name, code, imgArr, disabled } = this.state;
    return (
      <div className="page_box real_name">
        <Nav title="实名验证" back />
        <div className="page_menu">
          <div className="real_input_box">
            <div className="real_input">
              <div className="title">姓名</div>
              <div className="right">
                <input
                  type="text"
                  value={name}
                  placeholder="请输入姓名"
                  disabled={disabled}
                  onChange={(e) => {
                    this.setState({
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="real_input">
              <div className="title">证件号</div>
              <div className="right">
                <input
                  type="text"
                  value={code}
                  maxLength={18}
                  disabled={disabled}
                  placeholder="请输入证件号"
                  onChange={(e) => {
                    this.setState({
                      code: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* zhongdian1 */}
          <div className="upload_tip">
            请上传身份证正反面照片，保持身份证清晰可辨
          </div>
          {imgArr.map((v, i) => {
            return (
              <label className="up_box" key={i + "_label"}>
                <input
                  type="file"
                  hidden
                  disabled={disabled}
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) =>
                    this.selectImg(e.currentTarget.files[0], v.type)
                  }
                />

                {this.state[v.type] ? (
                  <img src={IP + "files-upload/" + this.state[v.type]} alt="" />
                ) : (
                  <div className="menu_box">
                    <Icon type="plus" size="sm" className="up_icon" />
                    <div>{v.title}</div>
                  </div>
                )}
              </label>
            );
          })}

          <button className="submit" type="button" onClick={this.submitFn}>
            提交
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(RealName);
