"use strict";!function(n){n.component("hostLabelSelector",{template:'\n        <form-with-button width="150px">\n          <content-area>\n            <form-multiple-select ng-model="$ctrl.value" options="$ctrl.labelSelectorsList" on-change="$ctrl.output()" placeholder="请选择主机标签" is-loading="$ctrl.isLoadingLabel" loading-text="正在获取主机标签" empty-text="无相关信息"></form-multiple-select>\n          </content-area>\n          <button-area>\n            <button type="button" ng-click="$ctrl.showHost()" >查看选中主机</button>\n          </button-area>  \n        </form-with-button>\n      ',bindings:{ngModel:"=?",cluster:"<?",hostEnv:"<?"},controller:["$scope","api","dialog",function(n,e,t){var o=this,l=!0,i=[];o.labelSelectorsList=[];var a=e.SimplePromise.resolve([]),r=function(){l||(o.ngModel=null,o.value=null),o.isLoadingLabel=!0,o.cluster&&o.cluster.id&&(a=e.cluster.listHostLabel(o.cluster.id).then(function(n){var e=n||[];return o.labelSelectorsList=e.filter(function(n){return"USER_LABEL_VALUE"===n.content}).map(function(n){return{text:n.name,value:n}}),o.labelSelectorsList}),a.catch(function(){}).then(function(){o.isLoadingLabel=!1,l=!1}))};o.showHost=function(){c();var n=[],l={loading:!0};e.cluster.listNodeByLabels(o.cluster.id,i).then(function(e){Array.prototype.push.apply(n,e)}).catch(function(){}).then(function(){l.loading=!1}),t.common({title:"主机列表",buttons:t.buttons.BUTTON_OK_ONLY,value:{nodeList:n,isLoadingNode:l},template:"\n                    <form-container>\n                    <form-table\n                        ng-model=\"value.nodeList\"\n                        template=\"nodeListByLabelsTable\"\n                        columns=\"[\n                            { text: '主机名', key: 'name', width: '30%' },\n                            { text: 'IP地址', key: 'ip', width: '30%' },\n                            { text: '实例个数', key: 'runningPods', width: '20%' },\n                            { text: '状态', key: 'status', width: '20%' },\n                        ]\"\n                        empty-text=\"{{ value.isLoadingNode.loading ? '加载中...' : '无主机信息' }}\"\n                    ></form-table>\n                    </form-container>\n                    <script type=\"text/ng-template\" id=\"nodeListByLabelsTable\">\n                        <div ng-if=\"column.key === 'name'\" ng-bind=\"value\"></div>\n                        <div ng-if=\"column.key === 'ip'\" ng-bind=\"value\"></div>\n                        <div ng-if=\"column.key === 'runningPods'\" ng-bind=\"value\"></div>\n                        <div ng-if=\"column.key === 'status'\" ng-bind=\"value\"></div>\n                    </script>\n                    ",size:600})};var m=function(){angular.isArray(o.ngModel)&&(angular.equals(o.ngModel,o.value)||o.ngModel.length>0&&a.then(function(n){(o.ngModel||[]).forEach(function(e){o.value=o.value.concat(n.filter(function(n){return e.name===n.text}))}),o.value=(o.value||[]).map(function(n){return n.value})}))};o.output=function(){angular.equals(o.ngModel,o.value)||(o.ngModel=o.value)};var c=function(){if(o.hostEnv){var n={TEST:{name:"TESTENV",content:"HOSTENVTYPE"},PROD:{name:"PRODENV",content:"HOSTENVTYPE"}};i=angular.copy(o.ngModel||[]),i=i.filter(function(n){return"HOSTENVTYPE"!==n.content}).concat(n[o.hostEnv])}};n.$watch("$ctrl.cluster",r),n.$watch("$ctrl.ngModel",m)}]}),n.component("imageTagSelector",{template:'\n            <form-select \n                ng-model="$ctrl.value" \n                name="$ctrl.name" \n                options="$ctrl.imageTagSelectorList" \n                on-change="$ctrl.output()"\n                placeholder="请选择版本" \n                is-loading="$ctrl.isLoadingImageTag" \n                loading-text="正在获取镜像版本" \n                required="$ctrl.required" \n                empty-text="无相关信息" \n            ></form-select>\n            <form-error-message form="$ctrl.form" target="{{ $ctrl.name }}">镜像版本不能为空！</form-error-message>\n            ',bindings:{name:"@",ngModel:"=?",image:"<?",required:"@",form:"<?"},controller:["$scope","api","$filter",function(n,e,t){var o=this,l=e.SimplePromise.resolve([]),i=function(){o.isLoadingImageTag=!0,o.image&&o.image.name&&o.image.registry&&(l=e.image.privateRegistry.listImageTags(o.image.name,o.image.registry).then(function(n){return o.imageTagSelectorList=(n||[]).map(function(n){return{value:n.tag,text:n.tag,remark:t("date")(n.createTime,"yyyy-MM-dd HH:mm:ss")}},[]),o.imageTagSelectorList}),l.then(function(){o.image.tag?0===o.imageTagSelectorList.length&&(o.imageTagSelectorList=[{value:o.image.tag,text:o.image.tag}],o.value=o.image.tag):o.value=o.imageTagSelectorList&&o.imageTagSelectorList[0]?o.imageTagSelectorList[0].value:void 0}).catch(function(){}).then(function(){o.isLoadingImageTag=!1}))},a=function(){angular.equals(o.ngModel,o.value)||o.ngModel&&l.then(function(){(o.imageTagSelectorList||[]).forEach(function(n){n.value===o.image.tag&&(o.value=n.value)})})};o.output=function(){angular.equals(o.ngModel,o.value)||(o.ngModel=o.value)},n.$watch("$ctrl.image",i),n.$watch("$ctrl.ngModel",a)}]}),n.component("volumeMountStorage",{template:'\n        <style>\n        .volume-mount-container-next { margin-right: 5px; }\n        .volume-mount-container-name{ flex-grow: 0; flex-basis: 20%; }\n        .volume-mount-container-type{ flex-grow: 0;flex-basis: 14%; }\n        .volume-mount-container-readonly{ flex-grow: 0;flex-basis: 9%; }\n        .volume-mount-container-content{ flex-grow: 2; }\n        .volume-mount-container-path-only{}\n        .volume-mount-container-path{ flex-grow: 0; flex-basis: 25%; margin-right: 5px;}\n        </style>\n        <form-array-container ng-model="$ctrl.ngModel" name="$ctrl.name" on-add="$ctrl.addVolumeMountItem()" template="$_volumeMountStorageItem" max-length="100" min-length="0" type="simple" param="$ctrl.param"></form-array-container>\n        <button ng-if="$ctrl.isDisplayCopyVolume()" type="button" ng-click="$ctrl.showVolumeMountTable()">复制已有存储</button>\n        <script type="text/ng-template" id="$_volumeMountStorageItem" >\n            <form-multiple-inline>\n                <form-multiple-inline-item class="volume-mount-container-type volume-mount-container-next">\n                    <form-select ng-model="$ctrl.ngModel[$index].volumeType" options="[{value: \'HOSTPATH\', text: \'主机目录\'},{value: \'EMPTYDIR\', text: \'实例内目录\'}]" placeholder="请选择存储类型" required show-search-input="never" empty-text="无相关信息"></form-select>\n                </form-multiple-inline-item>\n                <form-multiple-inline-item class="volume-mount-container-readonly volume-mount-container-next">\n                    <form-select ng-model="$ctrl.ngModel[$index].readonly" options="[{value: \'false\', text: \'读写\'}, {value: \'true\', text: \'只读\'}]" placeholder="请选择读写类型" required show-search-input="never"></form-select>\n                </form-multiple-inline-item>\n                <form-multiple-inline-item class="volume-mount-container-name volume-mount-container-next">\n                    <!--<div ng-bind="$ctrl.ngModel[$index].name"></div>-->\n                    <input type="text" ng-model="$ctrl.ngModel[$index].name" name="{{ $ctrl.param.name + \'name\' }}" placeholder="输入名称，不可重复" required pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?$">\n                </form-multiple-inline-item>\n                \n                <form-multiple-inline-item ng-class="{true: \'volume-mount-container-path-only\',false: \'volume-mount-container-path\'}[$ctrl.ngModel[$index].volumeType === \'EMPTYDIR\']">\n                    <input type="text" ng-model="$ctrl.ngModel[$index].containerPath" name="{{ $ctrl.param.name + \'containerPath\' }}" placeholder="容器内挂载路径，以/开头" required pattern="^/.*"/>\n                </form-multiple-inline-item>\n                <form-multiple-inline-item class="volume-mount-container-content" ng-if="$ctrl.ngModel[$index].volumeType === \'HOSTPATH\'">\n                    <input type="text" ng-model="$ctrl.ngModel[$index].hostPath" name="{{ $ctrl.param.name + \'hostPath\' }}" placeholder="主机内目录，以‘/’开头" required pattern="^/.*"/>\n                </form-multiple-inline-item>\n            </form-multiple-inline>\n        </script>\n        ',bindings:{name:"@",ngModel:"=?",cluster:"<?",namespace:"<?",containerConsoles:"<?",containerIndex:"@",imageName:"@"},controller:["$scope","api","dialog",function(n,e,t){var o=this;o.param={storageVolumeSelectorList:[],formName:o.formName,name:o.name};e.SimplePromise.resolve([]);o.addVolumeMountItem=function(){o.ngModel.push({copied:!1,name:"",volumeType:"HOSTPATH",readonly:"false",containerPath:"",hostPath:"",emptyDir:"",volumePVC:{claimName:"",readOnly:!1,volumeId:null,volumeName:null},volumeConfigMap:{}}),o.ngModel=o.ngModel.filter(function(n){return void 0!=n})},o.isDisplayCopyVolume=function(){return o.existentVolumeMountList&&o.existentVolumeMountList.length>0&&o.containerConsoles.length>1},o.showVolumeMountTable=function(){l(),t.common({title:"复制已有存储",buttons:t.buttons.BUTTON_OK_CANCEL,value:{existentVolumeMountList:o.existentVolumeMountList},template:"\n                    <form-container>\n                    <form-table\n                        ng-model=\"value.existentVolumeMountList\" \n                        template=\"existentVolumeMountTable\" \n                        columns=\"[\n                            { text: '类型', key: 'volumeType', width: '15%' },\n                            { text: '权限', key: 'readonly', width: '10%' },\n                            { text: '名称', key: 'name' },\n                            { text: '容器内路径', key: 'containerPath', width: '15%' },\n                            { text: '主机内目录', key: 'hostPath', width: '15%' },\n                            { text: '选择', key: 'option', width: '10%' },\n                        ]\" \n                        empty-text=\"无存储信息\" \n                    ></form-table>\n                    <script type=\"text/ng-template\" id=\"existentVolumeMountTable\">\n                        <div ng-if=\"column.key === 'name'\" ng-bind=\"value || '无'\"></div>\n                        <div ng-if=\"column.key === 'readonly'\" ng-bind=\"value === 'true' ? '只读': '读写'\"></div>\n                        <div ng-if=\"column.key === 'volumeType'\" ng-bind=\"value === 'HOSTPATH'? '主机目录': value === 'EMPTYDIR' ? '实例内目录': ''\"></div>\n                        <div ng-if=\"column.key === 'hostPath'\" ng-bind=\"value || '-'\"></div>\n                        <div ng-if=\"column.key === 'containerPath'\" ng-bind=\"value || '-'\"></div>\n                        <div ng-if=\"column.key === 'option'\">\n                            <div ng-show=\"row.name\">\n                            <form-input-checkbox ng-model=\"row.copied\" text=\"\" value=\"true\" value-false=\"false\" ></form-input-checkbox>\n                            </div>\n                            <div ng-show=\"!row.name\">无名称</div>\n                        </div>\n                    </script>\n                    </form-container>\n                    "}).then(function(n){n===t.button.BUTTON_OK?o.existentVolumeMountList.map(function(n){return n.copied===!0&&o.ngModel.every(function(e){return e.name!==n.name})&&(n.copied=!1,o.ngModel.push(angular.copy(n)),i()),n.copied=!1,n}):o.existentVolumeMountList.map(function(n){return n.copied=!1})}).catch(function(){o.existentVolumeMountList.map(function(n){return n.copied=!1})})};var l=function(){o.existentVolumeMountList=[],(o.containerConsoles||[]).forEach(function(n){(n.volumeMountConsoles||[]).forEach(function(n){o.existentVolumeMountList.every(function(e){return e.name!==n.name})&&o.existentVolumeMountList.push(n)})})},i=function(){angular.isArray(o.ngModel)&&o.ngModel.length};n.$watch("$ctrl.ngModel",l,!0),n.$watch("$ctrl.ngModel",i),n.$watch("$ctrl.containerConsoles.volumeMountConsoles",l,!0),n.$watch("$ctrl.name",function(){o.param.name=o.name})}]}),n.component("volumeMountConfigmap",{template:'\n        <style>\n        .config-map-name{ flex-grow: 0; flex-basis: 44%; margin-right: 6px;}\n        .config-map-path{ }\n        .config-map-error::before {\n            content: "";\n            position: absolute;\n            left: 10px;;\n            top: 20px;\n            width: 0;\n            height: 0;\n            border-top: 5px solid #f5707a;\n            border-right: 5px solid transparent;\n            border-left: 5px solid transparent;\n        }\n        .config-map-error{\n            position: absolute;\n            top: -20px;\n            padding: 0 10px;\n            width: 150px;\n            color: #fff;\n            background-color: #f5707a;\n            border-radius: 3px;\n            line-height: 20px;\n        }\n        </style>\n        <form-array-container ng-model="$ctrl.ngModel" name="$ctrl.name" on-add="$ctrl.addVolumeMountConfigMapItem()" template="$_volumeMountConfigMapItem" max-length="100" min-length="0" type="simple" param="$ctrl.param"></form-array-container>\n        <script type="text/ng-template" id="$_volumeMountConfigMapItem" >\n            <form-multiple-inline>\n                <form-multiple-inline-item class="config-map-name">\n                    <form-select ng-model="$ctrl.ngModel[$index].configMap" name="{{ $ctrl.param.name + \'configMapIns\' }}" options="$ctrl.ngModel[$index].configMapVolumeSelectorList" placeholder="请选择配置，不能为空且多个配置不能相同" required="true" show-search-input="always" empty-text="无相关信息"></form-select>\n                    <!--<div class="config-map-error" ng-show="$ctrl.ngModel[$index].configMap === undefined">配置不能为空</div>-->\n                </form-multiple-inline-item>\n                <form-multiple-inline-item class="config-map-path">\n                    <form-with-button width="90px">\n                        <content-area>\n                            <input type="text" ng-model="$ctrl.ngModel[$index].containerPath" name="{{ $ctrl.param.name + \'configMapPath\' }}" placeholder="容器内挂载路径，以‘/’开头" required pattern="^/.*"/>\n                        </content-area>\n                        <button-area>\n                            <button type="button" ng-click="$ctrl.param.setConfigFile($ctrl.ngModel[$index])">配置文件</button>\n                        </button-area>\n                    </form-with-button>\n                </form-multiple-inline-item>\n            </form-multiple-inline>\n        </script>\n    ',bindings:{name:"@",ngModel:"=?",cluster:"<?",namespace:"<?"},controller:["$scope","api","dialog",function(n,e,t){var o=this;o.param={name:"",setConfigFile:null},o.param.setConfigFile=function(n){n.configMap&&t.common({title:"配置文件",buttons:t.buttons.BUTTON_OK_CANCEL,value:{configMapVolume:n},template:'\n                    <form>\n                    <form-container>\n                    <form-table\n                        ng-model="value.configMapVolume.configMap.configFileList"\n                        template="configMapFilesTable"\n                        columns="[\n                            { text: \'配置文件\', key: \'name\', width: \'35%\' },\n                            { text: \'文件名(可以为空)\', key: \'path\', width: \'65%\' },\n                        ]"\n                        empty-text="无配置文件"\n                        param="{configMapVolume: value.configMapVolume}"\n                    ></form-table>\n                    </form-container>\n                    </form>\n                    <script type="text/ng-template" id="configMapFilesTable">\n                        <div ng-if="column.key === \'name\'" ng-bind="value" popover="{{row.content}}" popover-trigger="click" popover-placement="left" style="cursor: pointer;"></div>\n                        <div ng-if="column.key === \'path\'">\n                           <input type="text" ng-model="row.path" placeholder="{{ row.name }}"></td>\n                        </div>\n                    </script>\n                    ',size:600})};var l=e.SimplePromise.resolve([]),i=function(){o.cluster&&o.cluster.id&&o.namespace&&(l=e.configMap.listConfigMapByClusterIdAndNamespace(o.cluster.id,o.namespace).then(function(n){return o.configMapSelectorList=(n||[]).map(function(n){return{value:n,text:n.name}}),o.configMapSelectorList}))};i();var a=function(){angular.isArray(o.ngModel)&&0!==o.ngModel.length&&l.then(function(){o.ngModel.map(function(n){n.configMapVolumeSelectorList=angular.copy(o.configMapSelectorList),n.configMapVolumeSelectorList.forEach(function(e){if(n.name===e.text)return n.configMap=e.value,n.configMap.configFileList=n.volumeConfigMap.iterms?Object.keys(n.volumeConfigMap.iterms).map(function(t){return{name:t,content:e.value.data[t],path:n.volumeConfigMap.iterms?n.volumeConfigMap.iterms[t]:null}}):e.value.configFileList,n})})})};o.addVolumeMountConfigMapItem=function(){o.ngModel.push({name:"",volumeType:"CONFIGMAP",readonly:"false",containerPath:"",hostPath:"",emptyDir:"",volumePVC:{},volumeConfigMap:{configurationId:null,name:"",iterms:null}}),o.ngModel=o.ngModel.filter(function(n){return void 0!=n})},n.$watch("$ctrl.cluster",i),n.$watch("$ctrl.namespace",i),n.$watch("$ctrl.ngModel",a),n.$watch("$ctrl.name",function(){o.param.name=o.name})}]}),n.component("containerLog",{template:'\n        <div ng-if="!$ctrl.hasClusterLogConfig()"> 所选集群没有开启日志自动收集。不能进行日志相关配置。 </div>\n        <form-array-container ng-if="$ctrl.hasClusterLogConfig()" ng-model="$ctrl.ngModel" name="$ctrl.name" template="$_logItemContainer" max-length="100" min-length="0" type="complex" param="$ctrl.param"></form-array-container>                            \n        <script type="text/ng-template" id="$_logItemContainer" >\n            <div class="form-array-container-item" style="padding:10px;">\n                <input ng-model="$ctrl.ngModel[$index].logPath" type="text" name="{{ $ctrl.param.name + \'logPath\' }}" placeholder="请输入日志路径，不能放在根目录下" required ng-pattern="/^/.*[^/]$/" />\n                <form-input-checkbox ng-model="$ctrl.ngModel[$index].autoCollect" text="自动收集日志"  value="true" value-false="false" ></form-input-checkbox>\n                <div ng-if="$ctrl.ngModel[$index].autoCollect" >\n                    <div>\n                        <span>日志topic</span>\n                        <input ng-model="$ctrl.ngModel[$index].logTopic" type="text" name="{{ $ctrl.param.name + \'logTopic\' }}"  placeholder="请输入日志topic" required />\n                    </div>\n                    <div>\n                        <span>预处理命令</span>\n                        <a class="help-tip" popover="对收集到的日志做进一步处理，比如筛选或增减字段等，可以用grep和awk命令完成，命令以管道形式执行，因此必须以“|”开始，比如一个典型的处理命令为：   | grep &quot;ERROR\\|WARN\\| EXCEPTION\\| statistic&quot; | awk -vnhost=&quot;$HOSTNAME&quot; \'{print &quot;[&quot;nhost&quot;]--&quot;$0}\'，该命令将只筛选包含四个对应关键字的行，并且会在行首添加&quot;[hostname]--&quot;的字符串，参照可完成其他复杂的处理方式"></a>\n                        <input ng-model="$ctrl.ngModel[$index].processCmd" type="text" name="{{ $ctrl.param.name + \'processCmd\' }}" placeholder="请输入预处理命令" />\n                    </div>\n                </div>\n                <form-input-checkbox ng-model="$ctrl.ngModel[$index].autoDelete" text="自动删除日志" value="true" value-false="false"></form-input-checkbox>\n                <div ng-if="$ctrl.ngModel[$index].autoDelete">\n                    <span> 过期时间</span>\n                    <input ng-model="$ctrl.ngModel[$index].logExpired" type="number" min="1" name="{{ $ctrl.param.name + \'logExpired\' }}" placeholder="过期则自动删除" required ng-pattern="/^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/" />\n                    <span> 小时</span>\n                </div>\n            </div>\n        </script>\n        ',bindings:{name:"@",ngModel:"=",cluster:"<?"},controller:["$scope",function(n){var e=this;e.param={name:e.name},e.hasClusterLogConfig=function(){return e.cluster&&(1===e.cluster.logConfig||e.cluster.clusterLog)},n.$watch("$ctrl.name",function(){e.param.name=e.name})}]}),n.component("formMultipleItemScroll",{template:'\n        <style>\n        .form-multiple-item-scroll{\n            border-bottom: 1px solid #f9f9f9;\n        }\n        .form-multiple-item-scroll .com-tabset-scroll {\n            margin-left: 110px;\n        }\n        .form-multiple-item-scroll ul.com-list-tab{\n            padding: 0; border-bottom: none;\n        }\n        .form-multiple-itme-scroll ul.com-list-tab li a.link-list {\n            padding-bottom: 10px;\n        }\n        .form-multiple-item-scroll ul.com-list-tab li.nav-option {\n            width: 63px;\n            height: 52px;\n            padding: 0 0 0 20px;\n        }\n        .form-multiple-item-scroll ul.com-list-tab li:hover {\n            border-bottom: 2px solid #cbe6ff;\n        }\n        .form-multiple-item-scroll ul.com-list-tab li.active {\n            border-bottom: 2px solid #5dabf3;\n        }\n        .form-multiple-item-scroll ul.com-list-tab li.error-message a, .form-multiple-item-scroll .error-message{\n            color: #f5707a;\n        }\n        </style>\n        <div class="form-multiple-item-scroll">\n            <input type="hidden" name="$ctrl.name" ng-model="$ctrl.value" ng-required="$ctrl.required">\n            <ul list-scroll="list-scroll" width-offset="400">\n                <li class="nav-option" disabled="true">\n                    <span>\n                        <a class="icon-last to-last"></a>\n                        <a class="icon-next to-next"></a>\n                    </span>\n                </li>\n                <li style="pointer-events: none;">\n                    <div style="margin-left: 40px;" ng-if="!$ctrl.options || $ctrl.options.length === 0">\n                        <span>您尚未选择任何镜像。</span>\n                        <span ng-if="$ctrl.formObject.$submitted" class="error-message">请选择镜像</span>\n                    </div>\n                </li>\n                <li ng-repeat="option in $ctrl.options track by $index" ng-class="{ \'active\':$ctrl.ngModel===$index,\'error-message\':$ctrl.formObject[\'form\'+$index].$invalid && $ctrl.formObject[\'form\'+$index].$submitted}">\n                    <div class="container-wrap">\n                        <a ng-click="$ctrl.deleteOption($index);fresh()"><i class="fa fa-times"></i></a>\n                        <a class="link-list" ng-click="$ctrl.ngModel = $index;" ng-bind="option.name"></a>\n                    </div>\n                </li>\n            </ul>\n        </div>\n        ',bindings:{ngModel:"=",options:"=",formObject:"<",required:"<"},controller:["$scope",function(n){var e=this;e.ngModel=0,e.value=null,e.deleteOption=function(n){e.options.splice(n,1),n===e.ngModel||0===e.ngModel?e.ngModel=0:e.ngModel=e.ngModel-1};var t=function(n,t){e.ngModel=Math.max(Math.min(e.ngModel,e.options.length-1),0)},o=function(){0===e.options.length?e.value=null:e.options.forEach(function(n){e.value=n.name})};n.$watch("$ctrl.options.length",t,!0),n.$watch("$ctrl.options.length",o,!0)}]})}(angular.module("formInputs"));