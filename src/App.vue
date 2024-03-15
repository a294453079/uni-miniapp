<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";

/*每个页面公共css */
.footer {
  width: 100%;
  color: #969799;
  position: absolute;
  bottom: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    display: block;
    -webkit-flex: 1;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    flex-basis: 0;
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 0;
    background: #ebedf0;
  }

  &::before {
    content: '';
    display: block;
    -webkit-flex: 1;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    flex-basis: 0;
    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 0;
    background: #ebedf0;
  }
}
</style>
