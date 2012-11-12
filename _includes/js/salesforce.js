 var $j = jQuery;
 var defaultDisplayValue = "--";
 var requestURL = "http://goworks-donation.force.com/publicdatarequest"; // live url
 $j(document)
   .ready(function() {
   var wrapper = $j("#wrapper input[Name='item_merchant_id_1']");
   var camp_id = wrapper.val();

   $j.ajax({
     url: requestURL,
     type: "POST",
     data: "a=campaign_info&cam_name=" + camp_id,
     responseData: null,
     success: function(data, status, jqXHR) {
       responseData = data;
     },
     complete: function(jqXHR, status) {
       // available values: "success", "notmodified", "error", "timeout", "abort", or "parsererror"
       //alert(status);
       var cham_rev = defaultDisplayValue;
       var cham_amount = defaultDisplayValue;
       var cham_progress = defaultDisplayValue;
       var goalValStyleClass = "";

       if (status == "success" && responseData != null) {
         cham_rev = "$" + responseData.expectedRev;
         cham_amount = "$" + responseData.amountWon;
         cham_progress = responseData.progress + "%";
         goalValStyleClass = parseInt(cham_progress.replace(',', '')) >= 100 ? "green" : "red";
       }

       // display received values
       var elements = $j("#wrapper div.onewish_boxes");

       var displayTextValMap = {
         "fundraising goal": {
           value: cham_rev,
           styleClass: null
         },
         "amount raised": {
           value: cham_amount,
           styleClass: goalValStyleClass
         },
         "progress made": {
           value: cham_progress,
           styleClass: goalValStyleClass
         }
       };

       $j.each(elements, function(i, v) {
         ReplaceTargetValue(v, displayTextValMap);
       });
     }
   });
 });

 function ReplaceTargetValue(element, displayTextValMap) {
   var donate_name = $j(element)
     .find('div.onewish_name');
   if (donate_name.length > 0) {
     var cat_text = donate_name.find('p:first')
       .text();
     var val_name = donate_name.next()
       .find("p:first");
     if (val_name.length > 0) {
       var entry = displayTextValMap[cat_text.toLowerCase()];

       if (entry.value != null && entry.value.indexOf('undefined') == -1) {
         val_name.text(entry.value);
         if (entry.styleClass != null && !val_name.hasClass(entry.styleClass)) {
           val_name.addClass(entry.styleClass);
         }
       } else {
         val_name.text(defaultDisplayValue);
       }
     }
   }
 }
