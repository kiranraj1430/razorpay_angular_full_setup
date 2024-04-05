import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import axios from 'axios';
declare global {
  interface Window {
    Razorpay: any;
  }
}
@Component({
  selector: 'app-plansdashboard',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class plans
  extends BaseSchemaComponent
  implements OnInit
{
  ngZorro!: NgZorroModel;
  plans: BehaviorSubject<Array<IPlandDiscount>> = new BehaviorSubject<
    Array<IPlandDiscount>
  >([]);
  currentUser!: IUser;

  currentUserRole: BehaviorSubject<string | undefined> = new BehaviorSubject<
    string | undefined
  >(undefined);

  constructor(
    private PurchaseService: PurchaseServiceAPI,
    private readonly userService: UserServiceAPI,
    private readonly _router: Router,


  ) {
    super();
    this.isUserAbleToEdit.next(false);
  }

  async ngOnInit() {
    this.loadRazorpayScript();
  }
  async loadRazorpayScript() {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      // console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);
  }

  async payNow(plan: any, currentUser: any) {
    // plan and currentUser to get plan or products details and currentuser is used to get current logged in user information which we can render by api 
    try {
//i am using axios to post data to node js server to get order id, because order id is mandatory to make a payment and it will give additional secure. check server.js file which i have added into this repo.
      const response = await axios.post('http://localhost:3000/createorders', {
        amount: plan?.price * 100, // Convert to paise (assuming the amount is in rupees)
        currency: 'INR',
        receipt: 'TEST_RECEIPT',
      });

      // console.log('Response data:', response.data);

      const MyOrder = response.data;
      // once i get response from server side api call, i have binding the data like amount and order id to razorpay checkout options
      
      const options = {
        key: 'rzp_test_57zVLsAD7PSSFyWfpL', // Replace with your actual Razorpay API key ID
        amount: MyOrder?.amount,
        currency: 'INR',
        name: 'Kiran Raj dev',
        // description: 'Test',
        order_id: MyOrder?.id,
        prefill: {
          name: `${currentUser?.firstname} ${currentUser?.lastname}`,
          email: `${currentUser?.email}`,
          contact: `${currentUser?.mobilenumber}`
        },
           notes: {
      plan_details: `${plan?._id} & ${plan?.title}`,
      company_name: `${currentUser?.companyname}`,
      customer_name: `${currentUser?.firstname} ${currentUser?.lastname}`,
      email_id: `${currentUser?.email}`,
      mobile_number: `${currentUser?.mobilenumber}`
    },
        capture: true,
        status: 'captured',
        handler: (response: any) => {
          // console.log('Payment successful');
          // console.log('Payment ID:', response.razorpay_payment_id);
        },
        
        modal: {
          ondismiss: () => {
            // console.log('Payment failed or dismissed');
            // Handle payment failure or modal dismissal
          }
        }
      };

      // console.log('Options:', options);

      // Ensure Razorpay is defined before initializing
      if (window.hasOwnProperty('Razorpay')) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        // console.error('Razorpay is not loaded');
      }
    } catch (error) {
      // console.error('Error:', error);
      // Handle error if necessary
    }
  }
}
