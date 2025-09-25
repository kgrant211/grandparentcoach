import Purchases from 'react-native-purchases';

export async function initRevenueCat(apiKey: string, appUserId?: string) {
  Purchases.setLogLevel(Purchases.LOG_LEVEL.WARN);
  await Purchases.configure({ apiKey, appUserID: appUserId });
}

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return { data: offerings, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function purchaseMonthly() {
  try {
    const offerings = await Purchases.getOfferings();
    const monthlyPackage = offerings.current?.monthly;
    
    if (!monthlyPackage) {
      throw new Error('No monthly package available');
    }
    
    const purchaseResult = await Purchases.purchasePackage(monthlyPackage);
    return { data: purchaseResult, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function restore() {
  try {
    const restoreResult = await Purchases.restorePurchases();
    return { data: restoreResult, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function isPro() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch (error) {
    console.error('Error checking pro status:', error);
    return false;
  }
}

export async function getCustomerInfo() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return { data: customerInfo, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function checkTrialEligibility() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] === undefined;
  } catch (error) {
    console.error('Error checking trial eligibility:', error);
    return true; // Assume eligible if we can't check
  }
}
