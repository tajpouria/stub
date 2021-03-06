<template>
  <a-upload
    name="img"
    list-type="picture-card"
    class="img-upload"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="img" class="img-upload__img" />
    <div v-else>
      <a-icon :type="loading ? 'loading' : 'picture'" />
      <p class="ant-upload-text">
        {{ $t('component.imgUploadInput.upload hint') }}
      </p>
    </div>
  </a-upload>
</template>

<script>
import Vue from 'vue';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default Vue.extend({
  data() {
    return {
      loading: false,
      imageUrl: null,
    };
  },
  props: {
    setImageUrl: {
      required: true,
      type: Function,
    },
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.setImageUrl(imageUrl);
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isValidFormat =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp';
      if (!isValidFormat) {
        this.$message.error(this.$t('component.imgUploadInput.invalid format'));
      }

      const isValidSize = file.size < 50 * 1000;

      if (!isValidSize)
        this.$message.error(this.$t('component.imgUploadInput.less than 50k'));

      return isValidFormat && isValidSize;
    },
  },
});
</script>

<style lang="scss">
.img-upload {
  .ant-upload {
    position: relative;
    width: 128px;
    height: 128px;

    @include respond(tab-port) {
      width: 120px;
      height: 120px;
    }

    @include respond(phone) {
      width: 110px;
      height: 110px;
    }
  }

  &__img {
    width: 100%;
  }
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
