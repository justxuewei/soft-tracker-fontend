<template>
  <div>
    <a-row>
      <a-col :span="5">
        <div class="anchor">
          <a-anchor :offsetTop="60" :offsetBottom="120">
            <template v-if="anchor.length > 0" v-for="l1 in anchor">
              <a-anchor-link :href="'#' + l1.id" :title="l1.title">
                <template v-if="l1.children.length > 0" v-for="l2 in l1.children">
                  <a-anchor-link :href="'#' + l2.id" :title="l2.title">
                    <template v-if="l2.children.length > 0" v-for="l3 in l2.children">
                      <a-anchor-link :href="'#' + l3.id" :title="l3.title"></a-anchor-link>
                    </template>
                  </a-anchor-link>
                </template>
              </a-anchor-link>
            </template>
          </a-anchor>
        </div>
      </a-col>
      <a-col :span="19">
        <div class="markdown" style="width: 80%; margin: auto" v-html="markdownHtml"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import MarkdownIt from 'markdown-it'
  import hljs from 'highlight.js'
  import mdian from 'markdown-it-anchor'
  import AAnchorLink from 'ant-design-vue/es/anchor/AnchorLink'
  import 'highlight.js/styles/xcode.css'

  export default {
    name: 'MarkdownView',
    components: {AAnchorLink},
    props: ['markdown'],
    data() {
      return {
        markdownIt: new MarkdownIt({
          html: true,
          highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return '<pre class="hljs"><code>' +
                  hljs.highlight(lang, str, true).value +
                  '</code></pre>';
              } catch (__) {}
            }

            return '<pre class="hljs"><code>' + this.markdownIt.utils.escapeHtml(str) + '</code></pre>';
          }
        }).use(mdian, {
          callback: (e) => {
            this.buildAnchorToken(e)
          }
        }),
        anchorToken: [],
        anchor: [],
      }
    },
    computed: {
      markdownHtml() {
        console.log(">>> markdownHtml")
        return this.markdownIt.render(this.markdown)
      }
    },
    methods: {
      buildAnchorToken(e) {
        this.anchorToken.push(e)
      },
      buildAnchorHierarchy(e) {
        let level = 1
        let anchorLevel = this.anchor
        while (`h${level}` !== e.tag) {
          level++
          // 取出最后一个元素的子元素
          anchorLevel = anchorLevel[anchorLevel.length - 1].children
        }
        console.log(">>> push")
        anchorLevel.push({
          id: e.attrs[0][1],
          title: document.getElementById(e.attrs[0][1]).innerText,
          // title: '123',
          children: []
        })
      }
    },
    mounted() {
      this.$nextTick(function() {
        console.log('dom已更新')
        for (let e of this.anchorToken) {
                this.buildAnchorHierarchy(e)
        }
      })
    }
  }
</script>

<style lang="less">

  @import "../style/markdown-mixin";

  .markdown {
    .gitbook-markdown()
  }

</style>
