var needs = []
var arr1 = ['招聘人数', '学历', '工作年限', '工作时间']
if (arr1.indexOf(metaKey)) {
	needs.push(data.metas[metaKey])
}
needs.join('|')


<dl>
<dt>薪资：</dt>
<dd>data.metas['薪资水平']</dd>
<dt>地点：</dt>
<dd>data.localPath</dd>
<dt>职位：</dt>
<dd>data.metas['职位类别']</dd>
<dt>要求：</dt>
<dd>jobNeeds</dd>
<dt>福利：</dt>
<dd>data.metas['福利待遇']</dd>
</dl>