<script>
    import { onMount} from "svelte";
    import { fetch_get, fetch_post } from "lib/misc";

    let message;
    let _form = null;

    const template =
      {
        "display": "form",
        "components": [
          {
            "label": "General",
            "tableView": false,
            "key": "container",
            "type": "container",
            "input": true,
            "components": [
              {
                "title": "Generic",
                "theme": "primary",
                "collapsible": true,
                "key": "algemeen",
                "type": "panel",
                "label": "Algemeen",
                "input": false,
                "tableView": false,
                "components": [
                  {
                    "label": "Submit",
                    "showValidations": false,
                    "theme": "warning",
                    "tableView": false,
                    "key": "submit",
                    "type": "button",
                    "input": true
                  },
                  {
                    "label": "Send confirmation mails",
                    "tableView": false,
                    "defaultValue": false,
                    "persistent": false,
                    "key": "generic_enable_send_ack_email",
                    "type": "checkbox",
                    "input": true
                  }
                ],
                "collapsed": true
              }
            ]
          },
          {
            "label": "Student registration",
            "tableView": false,
            "key": "visitors",
            "type": "container",
            "input": true,
            "components": [
              {
                "title": "STUDENT registration",
                "theme": "primary",
                "collapsible": true,
                "key": "RegistratieTemplate1",
                "type": "panel",
                "label": "BEZOEKERS : Registratie template en e-mail",
                "input": false,
                "tableView": false,
                "components": [
                  {
                    "label": "Submit",
                    "showValidations": false,
                    "theme": "warning",
                    "tableView": false,
                    "key": "submit",
                    "type": "button",
                    "input": true
                  },
                  {
                    "label": "Arm sending confirmation mail",
                    "tableView": false,
                    "defaultValue": false,
                    "key": "student_register_arm_send_ack_mail",
                    "type": "checkbox",
                    "input": true
                  },
                  {
                    "label": "STUDENT registration (formio sandbox)",
                    "autoExpand": false,
                    "tableView": true,
                    "key": "student_register_template",
                    "type": "textarea",
                    "input": true
                  }
                ],
                "collapsed": true
              }
            ]
          }
        ]
      }

    onMount( async () => {
      try {
        const status = await fetch_get('/admin/settings/data');
        if (status.status) {
          Formio.createForm(document.getElementById('configuration_settings'), template).then((form) => {
            _form = form
            Object.entries(status.data).forEach(([k, v]) => {
              try {
                form.getComponent(k).setValue(v);
              } catch (error) {
                return;
              }
            });
            form.on('submit', async submission => {
              await fetch_post('/admin/settings/data', submission.data);
              _form.emit('submitDone')
              setTimeout(() => document.querySelector(".alert").style.display="none", 1000);
            })
          });
        }
      } catch (e) {
        alert(`Error: ${e}`);
        console.log(`Error: ${e}`);
      }

    });


</script>

<h1>This is the settings page</h1>
<div id="configuration_settings"></div>
